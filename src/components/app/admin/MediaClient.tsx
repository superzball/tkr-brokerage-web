// src/components/app/admin/MediaClient.tsx
// Media library: responsive card grid of assets with a mock upload + delete.
// Mock — no real file is stored; upload appends a placeholder asset + toast.

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { MediaAsset, MediaKind } from "@/types/portal";
import { EmptyState } from "@/components/app/EmptyState";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { useToast } from "@/components/app/toast";
import { useSession } from "@/lib/auth/SessionProvider";

const KIND_ICON: Record<MediaKind, IconName> = {
  image: "image",
  doc: "file",
  video: "play",
};

function fmtSize(kb: number) {
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
}

export function MediaClient({ initial }: { initial: MediaAsset[] }) {
  const t = useTranslations("admin.media");
  const user = useSession();
  const { toast } = useToast();
  const [assets, setAssets] = useState<MediaAsset[]>(initial);

  function upload() {
    const n = assets.length + 1;
    setAssets((prev) => [
      {
        id: `med_${Date.now()}`,
        name: `upload-${n}.png`,
        kind: "image",
        sizeKb: 120,
        uploadedBy: user.name,
        uploadedAt: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    toast(t("uploaded"), "success");
  }

  function remove(id: string) {
    setAssets((prev) => prev.filter((a) => a.id !== id));
    toast(t("deleted"), "info");
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-ink-500">{t("count", { n: assets.length })}</p>
        <Button variant="primary" size="sm" onClick={upload}>
          <Icon name="upload" size={14} /> {t("upload")}
        </Button>
      </div>

      {assets.length === 0 ? (
        <EmptyState icon="image" title={t("empty")} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {assets.map((a) => (
            <div key={a.id} className="card overflow-hidden group">
              <div className="aspect-video bg-sky-50 flex items-center justify-center text-brand-300">
                <Icon name={KIND_ICON[a.kind]} size={40} />
              </div>
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-600 text-ink-900 truncate" title={a.name}>
                    {a.name}
                  </p>
                  <button
                    type="button"
                    onClick={() => remove(a.id)}
                    aria-label={t("delete")}
                    className="w-7 h-7 rounded-lg text-ink-400 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center shrink-0"
                  >
                    <Icon name="x" size={14} />
                  </button>
                </div>
                <div className="mt-1.5 flex items-center gap-2 text-xs text-ink-400">
                  <span className="chip bg-ink-50 text-ink-500">{t(`kind.${a.kind}`)}</span>
                  <span className="tabnum">{fmtSize(a.sizeKb)}</span>
                </div>
                <p className="mt-1 text-xs text-ink-400 truncate">
                  {t("by")} {a.uploadedBy} · {a.uploadedAt}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
