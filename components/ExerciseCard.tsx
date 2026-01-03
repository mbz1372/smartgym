import Image from "next/image";
import { Exercise } from "@/lib/types";

type Props = {
  exercise: Exercise;
  onSelect?: (exercise: Exercise) => void;
};

export function ExerciseCard({ exercise, onSelect }: Props) {
  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ position: "relative", width: "100%", height: 180, overflow: "hidden", borderRadius: 10 }}>
        <Image
          src={exercise.gifUrl}
          alt={exercise.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          style={{ objectFit: "cover" }}
          loading="lazy"
        />
      </div>
      <div>
        <h3 style={{ margin: "8px 0" }}>{exercise.name}</h3>
        <div className="flex">
          <span className="badge">{exercise.bodyPart}</span>
          <span className="badge">{exercise.target}</span>
          <span className="badge">{exercise.equipment}</span>
        </div>
      </div>
      {onSelect && (
        <button className="btn" onClick={() => onSelect(exercise)}>
          Add to plan
        </button>
      )}
    </div>
  );
}
