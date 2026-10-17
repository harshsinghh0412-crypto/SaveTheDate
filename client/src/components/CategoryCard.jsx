function CategoryCard({ icon, title, count }) {
  return (
    <div className="category-card">

      <div className="category-icon">
        {icon}
      </div>

      <div>
        <h3>{title}</h3>
        <p>{count} events</p>
      </div>

    </div>
  );
}

export default CategoryCard;