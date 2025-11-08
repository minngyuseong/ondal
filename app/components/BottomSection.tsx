import DashedBox from "./DashedBox";
import ActionButtons from "./ActionButtons";

export default function BottomSection() {
  return (
    <div className="flex gap-4">
      {/* Three Dashed Boxes */}
      <div className="flex flex-1 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <DashedBox key={i} index={i} />
        ))}
      </div>

      {/* Action Buttons */}
      <ActionButtons />
    </div>
  );
}
