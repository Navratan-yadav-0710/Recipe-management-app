import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import RecipeForm from "../components/RecipeForm.jsx";
import { useRecipes } from "../context/useRecipes.jsx";

export default function RecipeDetails() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { recipes, favorites, toggleFavorite, updateRecipe, deleteRecipe } = useRecipes();
	const [isEditing, setIsEditing] = useState(false);
	const recipe = recipes.find((item) => item.id === id);

	if (!recipe) {
		return (
			<main className="empty-state details-not-found">
				<span aria-hidden="true">🍽️</span>
				<h1>Recipe not found</h1>
				<p>It may have been removed from your collection.</p>
				<Link to="/" className="button button-primary">Back to recipes</Link>
			</main>
		);
	}

	const isFavorite = favorites.includes(recipe.id);
	const handleDelete = () => {
		if (window.confirm(`Delete “${recipe.title}” from your recipes?`)) {
			deleteRecipe(recipe.id);
			navigate("/");
		}
	};

	if (isEditing) {
		return (
			<main className="form-page">
				<div className="page-intro">
					<span className="eyebrow">UPDATE YOUR COLLECTION</span>
					<h1>Edit <span>{recipe.title}.</span></h1>
					<p>Make changes to your saved recipe.</p>
				</div>
				<div className="form-panel">
					<RecipeForm
						initialValue={recipe}
						submitLabel="Save changes"
						onSubmit={(updates) => {
							updateRecipe(recipe.id, updates);
							setIsEditing(false);
						}}
					/>
				</div>
			</main>
		);
	}

	return (
		<main className="details-page">
			<Link className="back-link" to="/">← All recipes</Link>
			<section className="details-hero">
				<div className="details-image">
					<img
						src={recipe.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80"}
						alt={recipe.title}
					/>
				</div>
				<div className="details-copy">
					<span className="eyebrow">{recipe.category}</span>
					<h1>{recipe.title}</h1>
					<p>{recipe.description}</p>
					<div className="details-meta">
						<span>{recipe.time} min</span>
						<span>{recipe.servings} servings</span>
						<span>{recipe.difficulty}</span>
					</div>
					<div className="details-actions">
						<button className="button button-primary" type="button" onClick={() => setIsEditing(true)}>Edit recipe</button>
						<button
							className={`button button-secondary ${isFavorite ? "is-favorite" : ""}`}
							type="button"
							onClick={() => toggleFavorite(recipe.id)}
						>
							{isFavorite ? "♥ Saved" : "♡ Save"}
						</button>
						<button className="button button-danger" type="button" onClick={handleDelete}>Delete</button>
					</div>
				</div>
			</section>

			<section className="details-content">
				<div>
					<span className="eyebrow">GET EVERYTHING READY</span>
					<h2>Ingredients</h2>
					<ul className="ingredient-list">
						{recipe.ingredients.map((ingredient, index) => <li key={`${index}-${ingredient}`}>{ingredient}</li>)}
					</ul>
				</div>
				<div>
					<span className="eyebrow">TAKE IT STEP BY STEP</span>
					<h2>Method</h2>
					<ol className="instruction-list">
						{recipe.instructions.map((instruction, index) => <li key={`${index}-${instruction}`}>{instruction}</li>)}
					</ol>
				</div>
			</section>
		</main>
	);
}
