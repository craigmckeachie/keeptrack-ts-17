import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MOCK_PROJECTS } from '../MockProjects';
import { Provider } from 'react-redux';
import { store } from '../../state';
import ProjectsPage from '../ProjectsPage';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { url as projectsUrl } from '../projectAPI';
// import userEvent from '@testing-library/user-event';

// declare which API requests to mock
const server = setupServer(
  // capture "GET http://localhost:3000/projects?_page=1" requests
  rest.get(projectsUrl, (req, res, ctx) => {
    // respond using a mocked JSON body
    const page = Number(req.url.searchParams.get('_page'));
    if (page === 1) {
      return res(ctx.json(MOCK_PROJECTS));
    } else {
      return res(ctx.json(getMore_MOCK_PROJECTS));
    }
  })
);

describe('<ProjectsPage />', () => {
  function renderComponent() {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProjectsPage />
        </MemoryRouter>
      </Provider>
    );
  }

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test('should render without crashing', () => {
    renderComponent();
    expect(screen).toBeDefined();
  });

  test('should display loading', () => {
    renderComponent();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('should display projects', async () => {
    renderComponent();
    expect(await screen.findAllByRole('img')).toHaveLength(
      MOCK_PROJECTS.length
    );
  });

  test('should display more button', async () => {
    renderComponent();
    expect(
      await screen.findByRole('button', { name: /more/i })
    ).toBeInTheDocument();
  });

  // test('should display more records after clicking more', async () => {
  //   renderComponent();
  //   const moreButton = await screen.findByRole('button', { name: /more/i });
  //   const numberOfRecords = (await screen.findAllByRole('img')).length;
  //   await userEvent.click(moreButton);
  //   const updatedNumberOfRecords = await (await screen.findAllByRole('img'))
  //     .length;
  //   // console.log(numberOfRecords, updatedNumberOfRecords);
  // });

  test('should display more button with get', async () => {
    renderComponent();
    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
    expect(screen.getByRole('button', { name: /more/i })).toBeInTheDocument();
  });

  test('should display custom error on server error', async () => {
    server.use(
      rest.get(projectsUrl, (req, res, ctx) => {
        return res(ctx.status(500, 'Server error'));
      })
    );
    renderComponent();

    expect(
      await screen.findByText(/There was an error retrieving the project(s)./i)
    ).toBeInTheDocument();
  });
});
