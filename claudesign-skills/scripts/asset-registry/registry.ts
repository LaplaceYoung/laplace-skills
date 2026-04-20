export type AssetEntry = {
  asset: string;
  path: string;
  group?: string;
  subtitle?: string;
  status?: 'needs-review' | 'approved' | 'changes-requested';
};

export type AssetManifest = {
  items: AssetEntry[];
};

export function createAssetManifest(items: AssetEntry[] = []): AssetManifest {
  return { items };
}
