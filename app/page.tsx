import { Card } from "@/components/ui/Card";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
        NeuroLearn
      </h1>
      <p className="text-xl text-gray-400 mb-8">Your AI-Powered Second Brain</p>
      
      <div className="flex gap-4">
        <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
          <h3 className="text-xl font-semibold text-text-main group-hover:text-primary transition-colors">
            Title A
          </h3>
          <p className="text-text-muted mt-2 line-clamp-3">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laborum suscipit, labore voluptatibus accusantium unde, architecto, ipsum consequuntur perspiciatis aperiam ea fuga. Laboriosam eius, suscipit officiis cum quam nisi ut dolore?
          </p>
          <div className="mt-4 flex gap-2">
            <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-xs">abc</span>
            <span className="px-2 py-1 rounded bg-green-500/10 text-green-400 text-xs">dev</span>
          </div>
        </Card>

        <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
          <h3 className="text-xl font-semibold text-text-main group-hover:text-primary transition-colors">
            Title B
          </h3>
          <p className="text-text-muted mt-2 line-clamp-3">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laborum suscipit, labore voluptatibus accusantium unde, architecto, ipsum consequuntur perspiciatis aperiam ea fuga. Laboriosam eius, suscipit officiis cum quam nisi ut dolore?
          </p>
          <div className="mt-4 flex gap-2">
            <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-xs">abc</span>
            <span className="px-2 py-1 rounded bg-green-500/10 text-green-400 text-xs">dev</span>
          </div>
        </Card>

        <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
          <h3 className="text-xl font-semibold text-text-main group-hover:text-primary transition-colors">
            Title C
          </h3>
          <p className="text-text-muted mt-2 line-clamp-3">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laborum suscipit, labore voluptatibus accusantium unde, architecto, ipsum consequuntur perspiciatis aperiam ea fuga. Laboriosam eius, suscipit officiis cum quam nisi ut dolore?
          </p>
          <div className="mt-4 flex gap-2">
            <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-xs">abc</span>
            <span className="px-2 py-1 rounded bg-green-500/10 text-green-400 text-xs">dev</span>
          </div>
        </Card>
      </div>
    </div>
  );
}