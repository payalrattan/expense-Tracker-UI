import React from "react";
import styles from "./Form.module.css";

type FormProps = {
  type: "income" | "expense";
  categoriesOrSources: string[];
  formData: {
    amount: string;
    category?: string;
    source?: string;
    description: string;
    date: string;
  };
  otherValue: string;
  setOtherValue: (val: string) => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  updateItem: boolean;
  message: string | null;
};

export const Form: React.FC<FormProps> = ({
  type,
  categoriesOrSources,
  formData,
  otherValue,
  setOtherValue,
  handleChange,
  handleSubmit,
  updateItem,
  message,
}) => {
  return (
    <form className={styles.formTransaction} onSubmit={handleSubmit}>
      <label>Amount</label>
      <input
        type="number"
        step="0.01"
        min="0"
        name="amount"
        value={formData.amount}
        onChange={handleChange}
        required
      />

      <label>{type === "income" ? "Source" : "Category"}</label>
      <select
        name={type === "income" ? "source" : "category"}
        value={type === "income" ? formData.source : formData.category}
        onChange={(e) => {
          handleChange(e);
          if (e.target.value !== "Other") setOtherValue("");
        }}
        required
      >
        <option value="" disabled>
          Select {type === "income" ? "source" : "category"}
        </option>
        {categoriesOrSources.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      {(type === "income" ? formData.source : formData.category) ===
        "Other" && (
        <input
          type="text"
          placeholder={`Enter other ${
            type === "income" ? "source" : "category"
          }`}
          value={otherValue}
          onChange={(e) => setOtherValue(e.target.value)}
          required
        />
      )}

      <label>Description</label>
      <input
        type="text"
        name="description"
        value={formData.description}
        onChange={handleChange}
      />

      <label>Date</label>
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />

      <button type="submit">
        {updateItem
          ? `Update ${type.charAt(0).toUpperCase() + type.slice(1)}`
          : `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};
