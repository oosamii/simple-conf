// "use client";

// import { useState, useEffect, useCallback, Suspense } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Plus, Loader2, AlertCircle, RefreshCw, Folder } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { FolderBreadcrumbs } from "@/components/folder/Breadcrumbs";
// import { DocumentList } from "@/components/folder/DocumentList";
// import { DocumentPreview } from "@/components/folder/DocumentPreview";
// import { ProtectedRoute } from "@/lib/components/protected-route";
// import { folderService } from "@/lib/api/services/folders";
// import type {
//   GetFolderDetailResponse,
//   DocumentSummary,
//   FolderWithMeta,
// } from "@simpleconf/shared";

// function FolderContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const folderId = searchParams.get("id");

//   const [folderData, setFolderData] = useState<GetFolderDetailResponse | null>(
//     null
//   );
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const check = () => setIsMobile(window.innerWidth < 1024); // lg breakpoint
//     check();
//     window.addEventListener("resize", check);
//     return () => window.removeEventListener("resize", check);
//   }, []);

//   const fetchFolderData = useCallback(async () => {
//     if (!folderId) {
//       setFolderData(null);
//       setIsLoading(false);
//       return;
//     }

//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await folderService.getFolderDetails(folderId);
//       setFolderData(response);
//     } catch (err) {
//       setError("Failed to load folder");
//       console.error("Failed to fetch folder details:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [folderId]);

//   useEffect(() => {
//     fetchFolderData();
//     setSelectedDocId(null);
//   }, [fetchFolderData]);

//   const handleNewDocument = () => {
//     if (folderId) {
//       router.push(`/editor?folderId=${folderId}`);
//     }
//   };

//   const handleDocumentOpen = (docId: string) => {
//     router.push(`/document?id=${docId}`);
//   };

//   const handleSubfolderClick = (subfolderId: string) => {
//     router.push(`/folder?id=${subfolderId}`);
//   };

//   const selectedDoc = folderData?.documents.find(
//     (doc) => doc.id === selectedDocId
//   );

//   const handleDocumentSelect = (docId: string) => {
//     if (isMobile) {
//       router.push(`/document?id=${docId}`);
//     } else {
//       setSelectedDocId(docId);
//     }
//   };

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center py-16">
//         <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center py-16 gap-4">
//         <AlertCircle className="h-12 w-12 text-red-500" />
//         <p className="text-lg text-slate-600">{error}</p>
//         <Button variant="outline" onClick={fetchFolderData} className="gap-2">
//           <RefreshCw className="h-4 w-4" />
//           Retry
//         </Button>
//       </div>
//     );
//   }
//   // No folder selected - show root view
//   if (!folderId || !folderData) {
//     if (!folderId) {
//       router.push(`/`);
//     }
//     return (
//       <div className="space-y-6 p-6">
//         <FolderBreadcrumbs breadcrumbs={[]} />
//         <h1 className="text-2xl font-semibold">All Folders</h1>
//         <p className="text-slate-500">
//           Select a folder from the sidebar to browse documents.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 p-6">
//       {/* Breadcrumbs */}
//       <FolderBreadcrumbs breadcrumbs={folderData.breadcrumbs} />

//       {/* Folder Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <h1 className="text-2xl font-semibold">{folderData.folder.name}</h1>
//           <span className="text-sm text-slate-500">
//             ({folderData.documents.length} documents)
//           </span>
//         </div>
//         <Button
//           onClick={handleNewDocument}
//           className="bg-[#2563EB] hover:bg-[#1d4ed8] focus-visible:ring-2 focus-visible:ring-[#2563EB]"
//         >
//           <Plus className="h-4 w-4 mr-2" />
//           New Document
//         </Button>
//       </div>

//       {/* Subfolders */}
//       {folderData.subfolders.length > 0 && (
//         <div className="space-y-3">
//           <h2 className="text-sm font-medium text-slate-700">Subfolders</h2>
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
//             {folderData.subfolders.map((subfolder: FolderWithMeta) => (
//               <Card
//                 key={subfolder.id}
//                 className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${
//                   !subfolder.isAccessible ? "opacity-60" : ""
//                 }`}
//                 onClick={() =>
//                   subfolder.isAccessible && handleSubfolderClick(subfolder.id)
//                 }
//               >
//                 <div className="flex items-center gap-3">
//                   <Folder className="h-5 w-5 text-slate-400" />
//                   <div className="flex-1 min-w-0">
//                     <p className="font-medium text-slate-900 truncate">
//                       {subfolder.name}
//                     </p>
//                     <p className="text-xs text-slate-500">
//                       {subfolder.documentCount} documents
//                     </p>
//                   </div>
//                 </div>
//               </Card>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Documents */}
//       <div className="space-y-3">
//         <h2 className="text-sm font-medium text-slate-700">Documents</h2>

//         <div className="flex flex-col lg:flex-row gap-6">
//           {/* Document List */}
//           <div
//             className={[
//               "w-full transition-all duration-300",
//               // On mobile: hide list when preview is open
//               selectedDoc ? "hidden lg:block lg:w-[60%]" : "block",
//             ].join(" ")}
//           >
//             <DocumentList
//               documents={folderData.documents}
//               selectedId={selectedDocId}
//               // onSelect={setSelectedDocId}
//               onSelect={handleDocumentSelect}
//               onOpen={handleDocumentOpen}
//             />
//           </div>

//           {/* Preview Panel */}
//           {selectedDoc && (
//             <div className="w-full lg:w-[40%]">
//               {/* Mobile: give it a “back” feel */}
//               <div className="lg:hidden mb-3">
//                 <Button
//                   variant="outline"
//                   className="w-full"
//                   onClick={() => setSelectedDocId(null)}
//                 >
//                   Back to Documents
//                 </Button>
//               </div>

//               <DocumentPreview
//                 document={selectedDoc}
//                 onClose={() => setSelectedDocId(null)}
//               />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function FolderBrowsePage() {
//   return (
//     <ProtectedRoute>
//       <Suspense
//         fallback={
//           <div className="flex items-center justify-center py-16">
//             <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
//           </div>
//         }
//       >
//         <FolderContent />
//       </Suspense>
//     </ProtectedRoute>
//   );
// }

"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  Loader2,
  AlertCircle,
  RefreshCw,
  Folder,
  ChevronRight,
  FileText,
  Clock,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FolderBreadcrumbs } from "@/components/folder/Breadcrumbs";
import { DocumentList } from "@/components/folder/DocumentList";
import { DocumentPreview } from "@/components/folder/DocumentPreview";
import { ProtectedRoute } from "@/lib/components/protected-route";
import { folderService } from "@/lib/api/services/folders";
import type {
  GetFolderDetailResponse,
  DocumentSummary,
  FolderWithMeta,
} from "@simpleconf/shared";

function FolderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const folderId = searchParams.get("id");

  const [folderData, setFolderData] = useState<GetFolderDetailResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const fetchFolderData = useCallback(async () => {
    if (!folderId) {
      setFolderData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await folderService.getFolderDetails(folderId);
      setFolderData(response);
    } catch (err) {
      setError("Failed to load folder");
      console.error("Failed to fetch folder details:", err);
    } finally {
      setIsLoading(false);
    }
  }, [folderId]);

  useEffect(() => {
    fetchFolderData();
    setSelectedDocId(null);
  }, [fetchFolderData]);

  const handleNewDocument = () => {
    if (folderId) {
      router.push(`/editor?folderId=${folderId}`);
    }
  };

  const handleDocumentOpen = (docId: string) => {
    router.push(`/document?id=${docId}`);
  };

  const handleSubfolderClick = (subfolderId: string) => {
    router.push(`/folder?id=${subfolderId}`);
  };

  const selectedDoc = folderData?.documents.find(
    (doc) => doc.id === selectedDocId
  );

  const handleDocumentSelect = (docId: string) => {
    if (isMobile) {
      router.push(`/document?id=${docId}`);
    } else {
      setSelectedDocId(docId);
    }
  };

  // Loading state with animated skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="flex items-center justify-center py-32">
          <div className="text-center space-y-4">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
              <div className="absolute inset-0 h-12 w-12 animate-ping bg-blue-400 rounded-full opacity-20 mx-auto" />
            </div>
            <p className="text-slate-600 font-medium">
              Loading your workspace...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state with better visual design
  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 shadow-xl border-0 bg-white/80 backdrop-blur">
          <div className="text-center space-y-6">
            <div className="relative inline-block">
              <AlertCircle className="h-16 w-16 text-red-500" />
              <div className="absolute inset-0 h-16 w-16 bg-red-500 rounded-full opacity-10 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-slate-900">
                Something went wrong
              </h3>
              <p className="text-slate-600">{error}</p>
            </div>
            <Button
              onClick={fetchFolderData}
              className="gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // No folder selected
  if (!folderId || !folderData) {
    if (!folderId) {
      router.push(`/`);
    }
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-4xl mx-auto py-16">
          <Card className="p-12 text-center shadow-xl border-0 bg-white/80 backdrop-blur">
            <Folder className="h-20 w-20 text-slate-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-slate-900 mb-3">
              All Folders
            </h1>
            <p className="text-slate-600 text-lg">
              Select a folder from the sidebar to browse documents.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Breadcrumbs with enhanced styling */}
        <div className="animate-fadeIn">
          <FolderBreadcrumbs breadcrumbs={folderData.breadcrumbs} />
        </div>

        {/* Folder Header with gradient and shadow */}
        <div className="animate-fadeIn" style={{ animationDelay: "0.1s" }}>
          <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                    <Folder className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      {folderData.folder.name}
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {folderData.documents.length}{" "}
                      {folderData.documents.length === 1
                        ? "document"
                        : "documents"}
                    </p>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleNewDocument}
                className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Document
              </Button>
            </div>
          </Card>
        </div>

        {/* Subfolders with staggered animation */}
        {folderData.subfolders.length > 0 && (
          <div
            className="space-y-4 animate-fadeIn"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-blue-600" />
              <h2 className="text-lg font-semibold text-slate-800">
                Subfolders
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {folderData.subfolders.map(
                (subfolder: FolderWithMeta, index: number) => (
                  <Card
                    key={subfolder.id}
                    className={`group p-6 cursor-pointer border-0 bg-white/80 backdrop-blur shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${
                      !subfolder.isAccessible ? "opacity-60" : ""
                    } animate-fadeIn`}
                    style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                    onClick={() =>
                      subfolder.isAccessible &&
                      handleSubfolderClick(subfolder.id)
                    }
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-linear-to-br from-amber-400 to-orange-500 rounded-xl shadow-md group-hover:shadow-lg transition-shadow">
                        <Folder className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                          {subfolder.name}
                        </p>
                        <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {subfolder.documentCount} docs
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100" />
                    </div>
                  </Card>
                )
              )}
            </div>
          </div>
        )}

        {/* Documents Section */}
        <div
          className="space-y-4 animate-fadeIn"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-blue-600" />
            <h2 className="text-lg font-semibold text-slate-800">Documents</h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Document List */}
            <div
              className={`w-full transition-all duration-300 ${
                selectedDoc ? "hidden lg:block lg:w-[60%]" : "block"
              }`}
            >
              <Card className="border-0 bg-white/80 backdrop-blur shadow-xl overflow-hidden ">
                <DocumentList
                  documents={folderData.documents}
                  selectedId={selectedDocId}
                  onSelect={handleDocumentSelect}
                  onOpen={handleDocumentOpen}
                />
              </Card>
            </div>

            {/* Preview Panel */}
            {selectedDoc && (
              <div className="w-full lg:w-[40%] animate-fadeIn">
                <div className="lg:hidden mb-3">
                  <Button
                    variant="outline"
                    className="w-full border-0 bg-white/80 backdrop-blur shadow-md hover:shadow-lg"
                    onClick={() => setSelectedDocId(null)}
                  >
                    Back to Documents
                  </Button>
                </div>
                <Card className="border-0 bg-white/90 backdrop-blur shadow-xl sticky top-6">
                  <DocumentPreview
                    document={selectedDoc}
                    onClose={() => setSelectedDocId(null)}
                  />
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

export default function FolderBrowsePage() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
                <div className="absolute inset-0 h-12 w-12 animate-ping bg-blue-400 rounded-full opacity-20 mx-auto" />
              </div>
              <p className="text-slate-600 font-medium">Loading...</p>
            </div>
          </div>
        }
      >
        <FolderContent />
      </Suspense>
    </ProtectedRoute>
  );
}
