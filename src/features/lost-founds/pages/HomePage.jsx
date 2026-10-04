import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IconInbox, IconLoader2, IconSearch } from "@tabler/icons-react";
import Segmented from "../../../components/Segmented"; // Pastikan path ini benar
import useInput from "../../../hooks/useInput";
import { isDone } from "../../../helpers/toolsHelper";
import ItemCard from "../components/ItemCard";
import AddModal from "../modals/AddModal";
import { asyncChangeLostFound, asyncDeleteLostFound, asyncGetLostFounds } from "../states/action";

const STATUS_OPTIONS = [["all", "Semua"], ["lost", "Hilang"], ["found", "Ditemukan"]];
const PROGRESS_OPTIONS = [["all", "Semua"], ["open", "Berjalan"], ["done", "Selesai"]];
const SCOPE_OPTIONS = [["all", "Semua laporan"], ["mine", "Laporan saya"]];

export default function HomePage() {
  const dispatch = useDispatch();
  const { lostFounds, isLostFound } = useSelector((state) => state.lostFounds);

  const [scope, setScope] = useState("all");
  const [status, setStatus] = useState("all");
  const [progress, setProgress] = useState("all");
  const [adding, setAdding] = useState(false);
  const keyword = useInput("");

  const reload = useCallback(
    () => dispatch(asyncGetLostFounds({ is_me: scope === "mine" ? 1 : undefined })),
    [dispatch, scope],
  );

  useEffect(() => {
    reload();
  }, [reload]);

  const needle = keyword.value.trim().toLowerCase();
  const visible = lostFounds.filter(
    (item) =>
      (status === "all" || item.status === status) &&
      (progress === "all" || isDone(item) === (progress === "done")) &&
      `${item.title} ${item.description}`.toLowerCase().includes(needle),
  );

  const toggleDone = async (item) => {
    const changed = await dispatch(
      asyncChangeLostFound(item.id, {
        title: item.title,
        description: item.description,
        status: item.status,
        is_completed: isDone(item) ? 0 : 1,
      }),
    );
    if (changed) reload();
  };

  const remove = async (item) => {
    if (await dispatch(asyncDeleteLostFound(item.id))) reload();
  };

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Laporan</h2>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm"
        >
          + Buat Laporan
        </button>
      </div>

      {/* Filter dan Pencarian */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
        <div className="relative">
          <IconSearch size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            aria-label="Cari laporan"
            placeholder="Cari judul atau deskripsi…"
            value={keyword.value}
            onChange={keyword.onChange}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-11 pr-4 outline-none focus:border-blue-500 focus:bg-white transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <Segmented label="Cakupan" value={scope} options={SCOPE_OPTIONS} onChange={setScope} />
          <Segmented label="Jenis" value={status} options={STATUS_OPTIONS} onChange={setStatus} />
          <Segmented label="Progres" value={progress} options={PROGRESS_OPTIONS} onChange={setProgress} />
        </div>
      </div>

      {/* Konten Utama */}
      {isLostFound && (
        <p role="status" className="flex items-center justify-center gap-2 py-10 text-gray-500">
          <IconLoader2 className="animate-spin" /> Memuat laporan…
        </p>
      )}

      {!isLostFound && visible.length === 0 && (
        <div className="grid place-items-center gap-2 rounded-xl border-2 border-dashed border-gray-300 py-16 text-gray-400 bg-white">
          <IconInbox size={40} />
          <p className="font-semibold">Tidak ada laporan yang cocok.</p>
        </div>
      )}

      {!isLostFound && visible.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <ItemCard key={item.id} item={item} onToggleDone={toggleDone} onDelete={remove} />
          ))}
        </div>
      )}

      {adding && <AddModal onClose={() => setAdding(false)} onSaved={reload} />}
    </div>
  );
}