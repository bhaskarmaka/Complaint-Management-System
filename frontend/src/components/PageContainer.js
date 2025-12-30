function PageContainer({ title, children }) {
  return (
    <div className="container mt-4">
      <h3 className="mb-4">{title}</h3>
      {children}
    </div>
  );
}
export default PageContainer;
