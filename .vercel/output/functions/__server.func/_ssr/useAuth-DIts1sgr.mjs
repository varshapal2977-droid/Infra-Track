import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { t as supabase } from "./client-DdbXR2jE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useAuth-DIts1sgr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AuthContext = (0, import_react.createContext)({
	session: null,
	user: null,
	profile: null,
	isAdmin: false,
	loading: true,
	refresh: async () => {},
	signOut: async () => {}
});
function AuthProvider({ children }) {
	const [session, setSession] = (0, import_react.useState)(null);
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [isAdmin, setIsAdmin] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(true);
	async function loadUserData(userId) {
		if (!userId) {
			setProfile(null);
			setIsAdmin(false);
			return;
		}
		const [{ data: prof }, { data: roles }] = await Promise.all([supabase.from("profiles").select("*").eq("id", userId).maybeSingle(), supabase.from("user_roles").select("role").eq("user_id", userId)]);
		setProfile(prof ?? null);
		setIsAdmin(!!roles?.some((r) => r.role === "admin"));
	}
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
			setSession(next);
			setTimeout(() => void loadUserData(next?.user?.id), 0);
		});
		supabase.auth.getSession().then(async ({ data }) => {
			setSession(data.session);
			await loadUserData(data.session?.user?.id);
			setLoading(false);
		});
		return () => sub.subscription.unsubscribe();
	}, []);
	const value = {
		session,
		user: session?.user ?? null,
		profile,
		isAdmin,
		loading,
		refresh: () => loadUserData(session?.user?.id),
		signOut: async () => {
			await supabase.auth.signOut();
			setProfile(null);
			setIsAdmin(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value,
		children
	});
}
var useAuth = () => (0, import_react.useContext)(AuthContext);
//#endregion
export { useAuth as n, AuthProvider as t };
