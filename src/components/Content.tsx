export default function Content({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="xl:py-12 3xl:py-24 mx-auto">
      <div className="text-white w-full xl:w-10/12 bg-charcoal bg-opacity-80 xl:rounded-xl max-h-max mx-auto p-4 xl:p-8">
        <h2 className="text-xl 3xl:text-3xl 3xl:p-4 text-center">{title}</h2>
        {children}
      </div>
    </div>
  );
}
