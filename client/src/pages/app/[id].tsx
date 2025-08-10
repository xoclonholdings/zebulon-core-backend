import React from "react";
import { useLocation } from "wouter";
import { APP_LINKS } from "@/config/appLinks";

const AppPage: React.FC = () => {
  const [location] = useLocation();
  // Expecting route: /app/:id
  const match = location.match(/^\/app\/([^/]+)/);
  const appId = match ? match[1] : "";
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
