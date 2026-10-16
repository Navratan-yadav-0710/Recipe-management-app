import { useState } from "react";

const emptyForm = {
  title: "",
  category: "Dinner",
  time: "20",
  servings: "2",
  difficulty: "Easy",
  image: "",
  description: "",
  ingredients: "",
  instructions: "",
};

export default function RecipeForm({ onSubmit, initialValue = emptyForm, submitLabel = "Save recipe" }) {
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    ...initialValue,
    time: String(initialValue.time ?? emptyForm.time),
    servings: String(initialValue.servings ?? emptyForm.servings),
    ingredients: Array.isArray(initialValue.ingredients)
      ? initialValue.ingredients.join("\n")
      : initialValue.ingredients ?? "",
    instructions: Array.isArray(initialValue.instructions)
      ? initialValue.instructions.join("\n")
      : initialValue.instructions ?? "",
  }));
  const [error, setError] = useState("");

  const update = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const ingredients = form.ingredients.split("\n").map((item) => item.trim()).filter(Boolean);
    const instructions = form.instructions.split("\n").map((item) => item.trim()).filter(Boolean);
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      ingredients.length === 0 ||
      instructions.length === 0
    ) {
      setError("Please add a title, description, ingredients, and instructions.");
      return;
    }
    setError("");
    onSubmit({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      time: Math.max(1, Number(form.time) || 1),
      servings: Math.max(1, Number(form.servings) || 1),
      ingredients,
      instructions,
    });
  };

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      <label className="form-field">
        Recipe name
        <input name="title" value={form.title} onChange={update} required maxLength={90} placeholder="e.g. Lemon herb pasta" />
      </label>

      <div className="form-row">
        <label className="form-field">
          Category
          <select name="category" value={form.category} onChange={update}>
            {["Breakfast", "Lunch", "Dinner", "Dessert", "Snack", "Drinks"].map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
        <label className="form-field">
          Difficulty
          <select name="difficulty" value={form.difficulty} onChange={update}>
            {["Easy", "Medium", "Hard"].map((difficulty) => (
              <option key={difficulty}>{difficulty}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="form-row">
        <label className="form-field">
          Prep time (minutes)
          <input name="time" type="number" min="1" max="1440" value={form.time} onChange={update} />
        </label>
        <label className="form-field">
          Servings
          <input name="servings" type="number" min="1" max="100" value={form.servings} onChange={update} />
        </label>
      </div>

      <label className="form-field">
        Image URL <span className="field-optional">Optional</span>
        <input name="image" type="url" value={form.image} onChange={update} placeholder="https://example.com/your-recipe.jpg" />
      </label>

      <label className="form-field">
        Short description
        <textarea name="description" value={form.description} onChange={update} required rows="3" maxLength={240} placeholder="What makes this recipe special?" />
      </label>

      <label className="form-field">
        Ingredients <span className="field-optional">One per line</span>
        <textarea name="ingredients" value={form.ingredients} onChange={update} required rows="6" placeholder={"2 cups flour\n1 cup milk\nA pinch of salt"} />
      </label>

      <label className="form-field">
        Instructions <span className="field-optional">One step per line</span>
        <textarea name="instructions" value={form.instructions} onChange={update} required rows="6" placeholder={"Preheat the oven.\nMix the ingredients.\nBake until golden."} />
      </label>

      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button-primary form-submit" type="submit">{submitLabel}</button>
    </form>
  );
}
