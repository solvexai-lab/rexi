"use client";

import { useCallback, useState } from "react";
import { Upload, X, FileText, Image, AlertCircle, Plus } from "lucide-react";

interface FileEntry {
    file: File;
    id: string;
}

interface CompareUploadZoneProps {
    files: FileEntry[];
    onFilesChange: (files: FileEntry[]) => void;
    disabled?: boolean;
    warning?: string | null;
}

const ALLOWED_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/heic",
    "image/heif",
    "image/webp",
];
const MAX_FILES = 4;
const MAX_SIZE_MB = 4.5;

function getFileIcon(file: File) {
    if (file.type.startsWith("image/")) return Image;
    return FileText;
}

function formatSize(bytes: number) {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function CompareUploadZone({ files, onFilesChange, disabled, warning }: CompareUploadZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addFiles = useCallback(
        (newFiles: File[]) => {
            setError(null);
            const combined = [...files];
            for (const f of newFiles) {
                if (combined.length >= MAX_FILES) {
                    setError(`Maximum ${MAX_FILES} documents allowed.`);
                    break;
                }
                if (!ALLOWED_TYPES.includes(f.type)) {
                    setError(`"${f.name}" is not a supported format. Use PDF, JPEG, or PNG.`);
                    continue;
                }
                if (f.size > MAX_SIZE_MB * 1024 * 1024) {
                    setError(`"${f.name}" exceeds the ${MAX_SIZE_MB} MB limit.`);
                    continue;
                }
                combined.push({ file: f, id: `${f.name}-${Date.now()}-${Math.random()}` });
            }
            onFilesChange(combined);
        },
        [files, onFilesChange]
    );

    const removeFile = (id: string) => {
        onFilesChange(files.filter((f) => f.id !== id));
        setError(null);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) addFiles(Array.from(e.target.files));
        e.target.value = "";
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) addFiles(Array.from(e.dataTransfer.files));
    };

    const canAddMore = files.length < MAX_FILES;

    return (
        <div className="space-y-4">
            {/* Drop Zone — only shown when < MAX_FILES */}
            {canAddMore && (
                <label
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={onDrop}
                    className={`relative flex flex-col items-center justify-center gap-4 p-8 rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-300 group ${disabled
                            ? "opacity-50 cursor-not-allowed border-slate-200 bg-slate-50"
                            : isDragging
                                ? "border-blue-400 bg-blue-50/60 scale-[1.01]"
                                : "border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50"
                        }`}
                >
                    <input
                        type="file"
                        multiple
                        accept="application/pdf,image/jpeg,image/jpg,image/png,image/heic,image/heif,image/webp"
                        className="hidden"
                        onChange={onInputChange}
                        disabled={disabled}
                    />

                    {/* Upload Icon */}
                    <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${isDragging ? "bg-blue-600 text-white scale-110" : "bg-slate-100 text-slate-500 group-hover:bg-slate-900 group-hover:text-white"
                            }`}
                    >
                        <Upload className="w-7 h-7" />
                    </div>

                    <div className="text-center">
                        <p className="font-bold text-slate-900 text-lg">
                            {files.length === 0 ? "Upload insurance documents" : "Add another document"}
                        </p>
                        <p className="text-slate-500 text-sm mt-1">
                            PDF, JPEG, PNG or photo from camera • Max 4.5 MB
                        </p>
                        <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-slate-950 text-white text-sm font-bold rounded-xl">
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:block">Browse Files</span>
                            <span className="sm:hidden">Tap to Upload</span>
                        </div>
                    </div>

                    {/* Counter badge */}
                    <div className="absolute top-3 right-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {files.length} / {MAX_FILES}
                    </div>
                </label>
            )}

            {/* Max files reached hint */}
            {files.length >= MAX_FILES && (
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium bg-slate-50 rounded-2xl px-4 py-3">
                    <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
                    Maximum 4 documents added. Remove one to add another.
                </div>
            )}

            {/* File List */}
            {files.length > 0 && (
                <div className="space-y-2">
                    {files.map(({ file, id }, i) => {
                        const Icon = getFileIcon(file);
                        return (
                            <div
                                key={id}
                                className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm group"
                            >
                                {/* Number */}
                                <div className="w-8 h-8 rounded-xl bg-slate-950 text-white flex items-center justify-center text-sm font-bold shrink-0">
                                    {i + 1}
                                </div>
                                {/* Icon */}
                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                    <Icon className="w-5 h-5 text-slate-500" />
                                </div>
                                {/* Name + size */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-900 text-sm truncate">{file.name}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{formatSize(file.size)}</p>
                                </div>
                                {/* Remove */}
                                {!disabled && (
                                    <button
                                        onClick={() => removeFile(id)}
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 shrink-0"
                                        aria-label="Remove file"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Errors / Warnings */}
            {(error || warning) && (
                <div className="flex items-start gap-2 p-4 bg-amber-50 border border-amber-100 rounded-2xl text-sm text-amber-700 font-medium">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{error || warning}</span>
                </div>
            )}

            {/* Min 2 required hint */}
            {files.length === 1 && (
                <p className="text-center text-sm text-slate-400">
                    Add at least one more document to compare.
                </p>
            )}
        </div>
    );
}
