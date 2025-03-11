import { mockWebpages } from "../CalendarView";
import { getWebpageIcon } from "../../utils/iconUtils";

interface FiltersPanelProps {
  selectedWebpages: string[];
  setSelectedWebpages: React.Dispatch<React.SetStateAction<string[]>>; // Updated type
  statusFilter: string[];
  setStatusFilter: React.Dispatch<React.SetStateAction<string[]>>; // Updated type
}

export default function FiltersPanel({
  selectedWebpages,
  setSelectedWebpages,
  statusFilter,
  setStatusFilter,
}: FiltersPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4 mb-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Content Section
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {mockWebpages.map((webpage) => (
            <label
              key={webpage.name}
              className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                checked={selectedWebpages.includes(webpage.name)}
                onChange={(e) => {
                  setSelectedWebpages((prev) =>
                    e.target.checked
                      ? [...prev, webpage.name]
                      : prev.filter((name) => name !== webpage.name)
                  );
                }}
              />
              <div className="ml-3 flex items-center">
                {getWebpageIcon(webpage.name)}
                <div className="ml-2">
                  <span className="block font-medium text-gray-900">
                    {webpage.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    AI Model: {webpage.model}
                  </span>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Article Status
        </h3>
        <div className="flex space-x-4">
          {["published", "scheduled"].map((status) => (
            <label key={status} className="inline-flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                checked={statusFilter.includes(status)}
                onChange={(e) => {
                  setStatusFilter((prev) =>
                    e.target.checked
                      ? [...prev, status]
                      : prev.filter((s) => s !== status)
                  );
                }}
              />
              <span className="ml-2 capitalize">{status}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
