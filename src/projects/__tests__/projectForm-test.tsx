import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Project } from '../Project';
import ProjectForm from '../ProjectForm';
import { Provider } from 'react-redux';
import { store } from '../../state';
import userEvent from '@testing-library/user-event';

describe('<ProjectForm />', () => {
  let project: Project;
  let updatedProject: Project;
  let handleCancel: jest.Mock;
  let nameTextBox: any;
  let descriptionTextBox: HTMLElement;
  let budgetTextBox: HTMLElement;

  beforeEach(() => {
    project = new Project({
      id: 1,
      name: 'Mission Impossible',
      description: 'This is really difficult',
      budget: 100,
    });
    updatedProject = new Project({
      name: 'Ghost Protocol',
      description:
        'Blamed for a terrorist attack on the Kremlin, Ethan Hunt (Tom Cruise) and the entire IMF agency...',
    });
    handleCancel = jest.fn();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProjectForm project={project} onCancel={handleCancel} />
        </MemoryRouter>
      </Provider>
    );

    nameTextBox = screen.getByRole('textbox', {
      name: /project name/i,
    });
    descriptionTextBox = screen.getByRole('textbox', {
      name: /project description/i,
    });
    budgetTextBox = screen.getByRole('spinbutton', {
      name: /project budget/i,
    });
  });

  test('should load project into form', () => {
    expect(
      screen.getByRole('form', {
        name: /edit a project/i,
      })
    ).toHaveFormValues({
      name: project.name,
      description: project.description,
      budget: project.budget,
      isActive: project.isActive,
    });
  });

  test('should accept input', () => {
    userEvent.clear(nameTextBox);
    userEvent.type(nameTextBox, updatedProject.name);
    expect(nameTextBox).toHaveValue(updatedProject.name);

    userEvent.clear(descriptionTextBox);
    userEvent.type(descriptionTextBox, updatedProject.description);
    expect(descriptionTextBox).toHaveValue(updatedProject.description);

    userEvent.clear(budgetTextBox);
    userEvent.type(budgetTextBox, updatedProject.budget.toString());
    expect(budgetTextBox).toHaveValue(updatedProject.budget);
  });

  test('name should display required validation', async () => {
    userEvent.clear(nameTextBox);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  test('name should display minlength validation', async () => {
    userEvent.clear(nameTextBox);
    userEvent.type(nameTextBox, 'ab');
    expect(screen.getByRole('alert')).toBeInTheDocument();
    userEvent.type(nameTextBox, 'c');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
  test('budget should display not 0 validation', async () => {
    userEvent.clear(budgetTextBox);
    userEvent.type(budgetTextBox, '0');
    expect(screen.getByRole('alert')).toBeInTheDocument();
    userEvent.type(budgetTextBox, '1');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
