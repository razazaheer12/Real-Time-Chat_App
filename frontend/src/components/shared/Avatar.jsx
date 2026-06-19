export default function Avatar({ username, profilePic, size = "md" }) {
  const sizes = { sm: "w-7 h-7 text-xs", md: "w-9 h-9 text-sm", lg: "w-12 h-12 text-base", xl: "w-20 h-20 text-2xl" };
  const initials = username?.slice(0, 2).toUpperCase() || "??";

  if (profilePic) {
    return (
      <img
        src={profilePic}
        alt={username}
        className={`${sizes[size]} rounded-full object-cover`}
      />
    );
  }

  return (
    <div className={`${sizes[size]} rounded-full bg-violet-600 flex items-center justify-center text-white font-semibold`}>
      {initials}
    </div>
  );
}
