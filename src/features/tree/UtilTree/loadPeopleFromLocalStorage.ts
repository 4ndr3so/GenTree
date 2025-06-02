export function loadPeopleFromLocalStorage(): any[] | null {
  const raw = localStorage.getItem("familyTree");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}