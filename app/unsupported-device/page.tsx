import { Monitor, Smartphone } from "lucide-react";

export default function UnsupportedDevicePage() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
            <div className="max-w-md space-y-6">
                <div className="flex justify-center gap-4 text-muted-foreground">
                    <Smartphone className="w-16 h-16 opacity-50" />
                    <div className="w-px h-16 bg-border" />
                    <Monitor className="w-16 h-16 text-primary" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Device Not Supported
                    </h1>
                    <p className="text-muted-foreground">
                        Sorry, you cannot use this application on Android or iOS devices.
                    </p>
                </div>

                <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                    <p className="text-sm font-medium">
                        Please login with a Laptop or PC to continue.
                    </p>
                </div>
            </div>
        </div>
    );
}
