export function Title({ children }: { children: React.ReactNode }) {
    return (
        <h1 className="text-3xl font-bold text-sky-700 mb-4">
            {children}
        </h1>
    );
}