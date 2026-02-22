import { useAuthContext } from "../../context/AuthContext";
import useLogout from "../../hooks/useLogout";
import { BiLogOut } from "react-icons/bi";

const UserProfile = () => {
    const { authUser } = useAuthContext();
    const { loading, logout } = useLogout();

    if (!authUser) return null;

    return (
        <div className="mt-auto pt-6 border-t border-white/5">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-300 group">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full border border-volt/20 p-0.5 group-hover:border-volt/50 transition-colors bg-white/5 animate-pulse overflow-hidden">
                            <img
                                src={authUser.profilePic}
                                alt="user"
                                className="rounded-full w-full h-full object-cover opacity-0 transition-opacity duration-300"
                                onLoad={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.parentElement?.classList.remove("animate-pulse");
                                    target.classList.remove("opacity-0");
                                }}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    if (!target.dataset.retried) {
                                        target.dataset.retried = "true";
                                        const normalizedSeed = encodeURIComponent(authUser.username.replace(/\s+/g, "_"));
                                        const gender = authUser.gender === "female" ? "female" : "male";
                                        target.src = gender === "male"
                                            ? `https://api.dicebear.com/9.x/avataaars/svg?seed=${normalizedSeed}&top=shortRound,theCaesar,shortWaved,sides,shortFlat,shavedSides&backgroundType=gradientLinear&backgroundColor=b6e3f4,c0aede,d1d4f9,a1c4fd,c2e9fb,8fd3f4,a6c0fe,d4fc79,96e6a1,84fab0,e0c3fc,8ec5fc`
                                            : `https://api.dicebear.com/9.x/avataaars/svg?seed=${normalizedSeed}&top=longButNotTooLong,straight01,straight02,bigHair,bob,curly,curvy,dreads&backgroundType=gradientLinear&backgroundColor=ffdfbf,ffd5dc,d1d4f9,ff9a9e,fecfef,fbc2eb,a18cd1,f68084,fccb90,d57eeb,fad0c4,ffecd2`;
                                    } else {
                                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser.fullName)}&background=random`;
                                    }
                                    target.parentElement?.classList.remove("animate-pulse");
                                    target.classList.remove("opacity-0");
                                }}
                            />
                        </div>
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-volt rounded-full border-2 border-[#121215]"></div>
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-[0.9rem] font-bold text-white truncate leading-none mb-1">
                            {authUser.fullName}
                        </span>
                        <span className="text-[10px] text-white/30 font-semibold tracking-tighter truncate">
                            @{authUser.username}
                        </span>
                    </div>
                </div>

                <button
                    onClick={logout}
                    disabled={loading}
                    className="p-2 rounded-xl hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-all duration-300"
                    title="Logout Session"
                >
                    {loading ? (
                        <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                        <BiLogOut className="w-5 h-5" />
                    )}
                </button>
            </div>
        </div>
    );
};

export default UserProfile;
