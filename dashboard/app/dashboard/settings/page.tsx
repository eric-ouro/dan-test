import withAuth, { AuthedPageProps } from "@hoc/with-server-auth";

const SettingsPage = ({ user }: AuthedPageProps) => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="flex flex-col gap-2">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>User ID:</strong> {user.id}
        </p>
        <p>
          <strong>Last Sign In:</strong>{" "}
          {new Date(user.last_sign_in_at ?? "").toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default withAuth(SettingsPage);
