
-- ENUMS
CREATE TYPE public.app_role AS ENUM ('citizen','admin');
CREATE TYPE public.complaint_status AS ENUM ('pending','assigned','in_progress','resolved','rejected');
CREATE TYPE public.complaint_priority AS ENUM ('low','medium','high');
CREATE TYPE public.complaint_category AS ENUM ('road_pothole','streetlight','drainage','garbage','water_leakage','traffic_signage','public_property','other');

-- DEPARTMENTS
CREATE TABLE public.departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.departments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.departments TO authenticated;
GRANT ALL ON public.departments TO service_role;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- USER ROLES
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

-- new user -> profile + citizen role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name',''), COALESCE(NEW.email,''))
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'citizen')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- authority access code claim
CREATE OR REPLACE FUNCTION public.claim_admin_role(_code text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;
  IF _code IS DISTINCT FROM 'INFRA-ADMIN-2026' THEN RETURN false; END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), 'admin') ON CONFLICT DO NOTHING;
  RETURN true;
END; $$;

-- COMPLAINTS
CREATE SEQUENCE public.complaint_ref_seq START 10001;
CREATE TABLE public.complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id text NOT NULL UNIQUE DEFAULT ('INF-' || nextval('public.complaint_ref_seq')),
  user_id uuid,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category public.complaint_category NOT NULL DEFAULT 'other',
  priority public.complaint_priority NOT NULL DEFAULT 'medium',
  status public.complaint_status NOT NULL DEFAULT 'pending',
  department_id uuid REFERENCES public.departments(id) ON DELETE SET NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  address text NOT NULL DEFAULT '',
  area text,
  image_url text,
  remarks text,
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);
CREATE INDEX idx_complaints_status ON public.complaints(status);
CREATE INDEX idx_complaints_category ON public.complaints(category);
CREATE INDEX idx_complaints_priority ON public.complaints(priority);
CREATE INDEX idx_complaints_user ON public.complaints(user_id);
CREATE INDEX idx_complaints_created ON public.complaints(created_at);
GRANT SELECT ON public.complaints TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.complaints TO authenticated;
GRANT ALL ON public.complaints TO service_role;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  IF NEW.status = 'resolved' AND (OLD.status IS DISTINCT FROM 'resolved') THEN
    NEW.resolved_at = now();
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER complaints_touch BEFORE UPDATE ON public.complaints
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- STATUS HISTORY
CREATE TABLE public.status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id uuid NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  old_status public.complaint_status,
  new_status public.complaint_status NOT NULL,
  changed_by uuid,
  remarks text,
  changed_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_status_history_complaint ON public.status_history(complaint_id);
GRANT SELECT ON public.status_history TO anon;
GRANT SELECT, INSERT ON public.status_history TO authenticated;
GRANT ALL ON public.status_history TO service_role;
ALTER TABLE public.status_history ENABLE ROW LEVEL SECURITY;

-- NOTIFICATIONS
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  complaint_id uuid REFERENCES public.complaints(id) ON DELETE CASCADE,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- POLICIES
CREATE POLICY "departments public read" ON public.departments FOR SELECT USING (true);
CREATE POLICY "departments admin write" ON public.departments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "profiles self read" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "profiles self insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "profiles self update" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "roles self read" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "complaints public read" ON public.complaints FOR SELECT USING (true);
CREATE POLICY "complaints citizen insert" ON public.complaints FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "complaints admin update" ON public.complaints FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "complaints owner delete" ON public.complaints FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "history public read" ON public.status_history FOR SELECT USING (true);
CREATE POLICY "history insert" ON public.status_history FOR INSERT TO authenticated
  WITH CHECK (changed_by = auth.uid());

CREATE POLICY "notifications own read" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "notifications insert" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "notifications own update" ON public.notifications FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "notifications own delete" ON public.notifications FOR DELETE TO authenticated USING (user_id = auth.uid());

-- DEPARTMENTS SEED
INSERT INTO public.departments (name, description) VALUES
 ('Roads Department','Road surfaces, potholes and footpaths'),
 ('Electrical Department','Streetlights and public electrical assets'),
 ('Water Department','Water supply lines and leakages'),
 ('Sanitation Department','Garbage collection and cleanliness'),
 ('Drainage Department','Storm water drains and sewer blockages'),
 ('Public Works Department','Public property, signage and general works');

-- DEMO COMPLAINTS
INSERT INTO public.complaints (title, description, category, priority, status, department_id, latitude, longitude, address, area, is_demo, created_at, resolved_at)
SELECT d.title, d.description, d.category::public.complaint_category, d.priority::public.complaint_priority, d.status::public.complaint_status,
       (SELECT id FROM public.departments WHERE name = d.dept),
       d.lat, d.lng, d.address, d.area, true,
       now() - (d.days_ago || ' days')::interval,
       CASE WHEN d.status = 'resolved' THEN now() - ((d.days_ago - d.res_days) || ' days')::interval ELSE NULL END
FROM (VALUES
 ('Large pothole near Andheri metro','Deep pothole causing two-wheeler skids during rain.','road_pothole','high','resolved','Roads Department',19.1197,72.8468,'Andheri East, Mumbai','Andheri',60,12),
 ('Streetlight not working on Link Road','Entire stretch dark for a week.','streetlight','medium','resolved','Electrical Department',19.1360,72.8290,'Link Road, Malad, Mumbai','Malad',55,9),
 ('Drain overflowing at Sion circle','Sewage water on the road after rainfall.','drainage','high','in_progress','Drainage Department',19.0400,72.8620,'Sion Circle, Mumbai','Sion',20,0),
 ('Garbage not collected for 5 days','Bins overflowing near the market.','garbage','medium','pending','Sanitation Department',19.0176,72.8562,'Dadar Market, Mumbai','Dadar',4,0),
 ('Water pipeline leakage','Continuous water loss on the main road.','water_leakage','high','assigned','Water Department',28.6139,77.2090,'Connaught Place, New Delhi','CP',9,0),
 ('Broken traffic signal','Signal blinking, causing confusion.','traffic_signage','high','in_progress','Public Works Department',28.5355,77.3910,'Sector 18, Noida','Noida',14,0),
 ('Damaged footpath tiles','Tiles uprooted near bus stop.','public_property','low','pending','Public Works Department',28.4595,77.0266,'Cyber City, Gurugram','Gurugram',6,0),
 ('Manhole cover missing','Open manhole, serious safety hazard.','drainage','high','resolved','Drainage Department',12.9716,77.5946,'MG Road, Bengaluru','MG Road',40,5),
 ('Potholes on Outer Ring Road','Multiple potholes slowing traffic.','road_pothole','high','in_progress','Roads Department',12.9352,77.6245,'Koramangala, Bengaluru','Koramangala',18,0),
 ('Streetlight pole tilted','Pole leaning dangerously over footpath.','streetlight','medium','assigned','Electrical Department',12.9279,77.6271,'BTM Layout, Bengaluru','BTM',11,0),
 ('Garbage dumped in empty plot','Illegal dumping creating stench.','garbage','medium','rejected','Sanitation Department',17.4483,78.3915,'Hitech City, Hyderabad','Hitech City',30,0),
 ('Water tap leaking in park','Public tap running continuously.','water_leakage','low','resolved','Water Department',17.4239,78.4738,'Banjara Hills, Hyderabad','Banjara Hills',35,7),
 ('Road caved in after digging','Utility work left the road unrepaired.','road_pothole','high','pending','Roads Department',13.0827,80.2707,'Mount Road, Chennai','Mount Road',3,0),
 ('Dark stretch near school','Streetlights off, unsafe for students.','streetlight','high','assigned','Electrical Department',13.0500,80.2121,'T Nagar, Chennai','T Nagar',8,0),
 ('Clogged storm water drain','Water logging even in light rain.','drainage','medium','in_progress','Drainage Department',18.5204,73.8567,'Shivajinagar, Pune','Shivajinagar',16,0),
 ('Overflowing community bin','Bin not emptied, stray animals around.','garbage','medium','resolved','Sanitation Department',18.5089,73.9260,'Hadapsar, Pune','Hadapsar',45,10),
 ('Signage board fallen','Direction board fell after storm.','traffic_signage','low','pending','Public Works Department',18.5679,73.9143,'Viman Nagar, Pune','Viman Nagar',2,0),
 ('Broken park bench and fencing','Public park property vandalised.','public_property','low','pending','Public Works Department',22.5726,88.3639,'Park Street, Kolkata','Park Street',5,0),
 ('Sewer line blockage','Sewage backflow into houses.','drainage','high','assigned','Drainage Department',22.5958,88.4000,'Salt Lake, Kolkata','Salt Lake',10,0),
 ('Water supply contamination','Muddy water coming from taps.','water_leakage','high','in_progress','Water Department',23.0225,72.5714,'Navrangpura, Ahmedabad','Navrangpura',13,0),
 ('Speed breaker unmarked','Unpainted speed breaker causing accidents.','traffic_signage','medium','resolved','Public Works Department',23.0300,72.5100,'SG Highway, Ahmedabad','SG Highway',50,8),
 ('Potholes near railway crossing','Rough patch damaging vehicles.','road_pothole','medium','pending','Roads Department',26.9124,75.7873,'Malviya Nagar, Jaipur','Malviya Nagar',7,0),
 ('Street light flickering','Light flickers all night.','streetlight','low','resolved','Electrical Department',26.8500,75.8000,'Tonk Road, Jaipur','Tonk Road',38,6),
 ('Garbage burning in open','Smoke causing breathing issues.','garbage','high','in_progress','Sanitation Department',21.1458,79.0882,'Sitabuldi, Nagpur','Sitabuldi',12,0),
 ('Damaged bus shelter','Roof sheet blown off.','public_property','low','rejected','Public Works Department',21.1200,79.0500,'Dharampeth, Nagpur','Dharampeth',25,0),
 ('Leaking water tank','Overhead tank overflowing daily.','water_leakage','medium','assigned','Water Department',19.9975,73.7898,'College Road, Nashik','Nashik',9,0),
 ('Road divider broken','Divider blocks scattered on road.','road_pothole','medium','in_progress','Roads Department',15.2993,74.1240,'Panaji, Goa','Panaji',15,0),
 ('No streetlight in new colony','New layout has no lighting.','streetlight','medium','pending','Electrical Department',11.0168,76.9558,'Gandhipuram, Coimbatore','Coimbatore',6,0),
 ('Open drain beside footpath','Uncovered drain next to walkway.','drainage','high','resolved','Drainage Department',9.9312,76.2673,'MG Road, Kochi','Kochi',48,11),
 ('Stray litter around lake','Plastic waste near lake shore.','other','low','pending','Sanitation Department',17.3850,78.4867,'Hussain Sagar, Hyderabad','Hussain Sagar',1,0)
) AS d(title,description,category,priority,status,dept,lat,lng,address,area,days_ago,res_days);

-- history for demo complaints
INSERT INTO public.status_history (complaint_id, old_status, new_status, remarks, changed_at)
SELECT id, NULL, 'pending', 'Complaint submitted (demo data)', created_at FROM public.complaints WHERE is_demo;
INSERT INTO public.status_history (complaint_id, old_status, new_status, remarks, changed_at)
SELECT id, 'pending', status, 'Status updated by authority (demo data)', created_at + interval '2 days'
FROM public.complaints WHERE is_demo AND status <> 'pending';
