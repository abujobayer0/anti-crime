import { VIEW_MODES } from "./types";

export const MapControls = ({
  viewMode,
  onToggleViewMode,
}: {
  viewMode: any;
  onToggleViewMode: any;
}) => (
  <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm p-2 rounded-lg shadow-lg z-50">
    <button
      onClick={onToggleViewMode}
      className="p-2 hover:bg-gray-100 rounded-md transition-colors"
      title={
        viewMode === VIEW_MODES.MARKERS
          ? "Switch to Heatmap"
          : "Switch to Markers"
      }
    >
      {viewMode === VIEW_MODES.MARKERS ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-700"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l.707.707.707-.707A1 1 0 0115 2v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0V7h-3a1 1 0 010-2h3V2a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-700"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  </div>
);
