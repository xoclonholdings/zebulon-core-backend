import React from "react";
import { useRouter } from "next/router";
import { APP_LINKS } from "@/config/appLinks";

const AppPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const appId = typeof id === "string" ? id : Array.isArray(id) ? id[0] : "";
  const external = APP_LINKS[appId];

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="w-full flex justify-end p-4">
        {external?.externalUrl && (
          <a
            href={external.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
            aria-label={external.externalLabel}
          >
            {external.externalLabel}
          </a>
        )}
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">{appId?.toUpperCase()} App</h1>
        {/* TODO: Render the actual app UI here, e.g. <ZedChat /> for zed, etc. */}
        <div className="text-gray-400">Integrated {appId} UI goes here.</div>
      </div>
    </div>
  );
};

export default AppPage;
