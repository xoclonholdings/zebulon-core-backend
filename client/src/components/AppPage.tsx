import { useRoute } from "wouter";
import { APP_LINKS } from "../config/appLinks";
import { Button } from "./ui/button";

const AppPage = () => {
  const [match, params] = useRoute("/app/:id");
  const appId = params?.id || "";
  const external = APP_LINKS[appId];

  // ...existing code...
  const renderAppUI = () => {
    switch (appId) {
      case "zed":
        return <div className="text-gray-400">Integrated ZED UI goes here.</div>;
  // ZETA UI removed
      case "zlab":
        return <div className="text-gray-400">Integrated ZLAB UI goes here.</div>;
      case "zwap":
        return <div className="text-gray-400">Integrated ZWAP UI goes here.</div>;
      case "zync":
        return <div className="text-gray-400">Integrated ZYNC UI goes here.</div>;
      case "zulu":
        return <div className="text-gray-400">Integrated ZULU UI goes here.</div>;
      default:
        return <div className="text-gray-400">Unknown app: {appId}</div>;
    }
  };

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
        {renderAppUI()}
      </div>
    </div>
  );
};

export default AppPage;
