import { Badge } from "@/components/ui/badge"

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-gray-50 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-green-600 border-green-600">API: Online</Badge>
            <span className="text-sm text-gray-600">
              Powered by Amazon Nova Lite
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Version 1.0.0
          </div>
        </div>
      </div>
    </footer>
  )
}

