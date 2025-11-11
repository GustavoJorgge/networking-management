export function Content({ children }: { children: React.ReactNode }) {
    return (
        <div className="content text-gray-500">
            {children}
        </div>
    );
}