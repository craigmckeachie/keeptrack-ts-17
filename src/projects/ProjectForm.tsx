import React, { SyntheticEvent, useState } from 'react';
import { Project } from './Project';

interface ProjectFormProps {
  project: Project;
  onSave: (project: Project) => void;
  onCancel: () => void;
}

function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [budget, setBudget] = useState(project.budget);
  const [isActive, setIsActive] = useState(project.isActive);

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    onSave(new Project({ ...project, name, description, budget, isActive }));
  };

  return (
    <form className="input-group vertical" onSubmit={handleSubmit}>
      <label htmlFor="name">Project Name</label>
      <input
        type="text"
        name="name"
        placeholder="enter name"
        value={name}
        onChange={(event) => {
          setName(event.target.value);
        }}
      />
      <label htmlFor="description">Project Description</label>
      <textarea
        name="description"
        placeholder="enter description"
        value={description}
        onChange={(event) => {
          setDescription(event.target.value);
        }}
      />
      <label htmlFor="budget">Project Budget</label>
      <input
        type="number"
        name="budget"
        placeholder="enter budget"
        value={budget}
        onChange={(event) => {
          setBudget(Number(event.target.value));
        }}
      />
      <label htmlFor="isActive">Active?</label>
      <input
        type="checkbox"
        name="isActive"
        checked={isActive}
        onChange={(event) => {
          setIsActive(Boolean(event.target.checked));
        }}
      />
      <div className="input-group">
        <button className="primary bordered medium">Save</button>
        <span />
        <button type="button" className="bordered medium" onClick={onCancel}>
          cancel
        </button>
      </div>
    </form>
  );
}

export default ProjectForm;
