// preview page for newly created UI components
import Skeleton from "@/components/Skeleton"
import Avatar from "@/components/Avatar"

export default function PreviewPage() {
  return (
    <div className="page-content">
      <h2>Preview</h2>

      <h3>Avatar</h3>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <Avatar alt="Jane Doe" size="sm" />
        <Avatar alt="Jane Doe" size="md" />
        <Avatar alt="Jane Doe" size="lg" />
        <Avatar src="https://i.pravatar.cc/150?img=5" alt="Agent Photo" size="md" />
        <Avatar alt="Single" size="md" />
      </div>

      <h3>Skeleton</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem" }}>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    </div>
  )
}
