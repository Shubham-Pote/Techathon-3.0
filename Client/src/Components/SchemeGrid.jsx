import { schemes } from "../Data/Schemes"
import SchemeCard from "./SchemeCard"

export default function SchemeGrid() {
  return (
    <div className="space-y-4 gap-4">
      {schemes.map((s) => (
        <SchemeCard key={s.id} scheme={s} />
      ))}
    </div>
  )
}
