import React, { useEffect } from 'react';
import { Project } from './Project';
import ProjectList from './ProjectList';

import useProjects from './useProjects';

function ProjectsPage() {
  const {
    loading,
    projects,
    error,
    page,
    moreProjects,
    saveProject,
  } = useProjects();

  const handleSave = (project: Project) => {
    saveProject(project);
  };

  const handleMoreClick = () => {
    moreProjects(page + 1);
  };

  return (
    <>
      <h1>Projects</h1>

      {error && (
        <div className="row">
          <div className="card large error">
            <section>
              <p>
                <span className="icon-alert inverse "></span>
                {error}
              </p>
            </section>
          </div>
        </div>
      )}

      <ProjectList projects={projects} onSave={handleSave} />

      {!loading && !error && (
        <div className="row">
          <div className="col-sm-12">
            <div className="button-group fluid">
              <button className="button default" onClick={handleMoreClick}>
                More...
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="center-page">
          <span className="spinner primary"></span>
          <p>Loading...</p>
        </div>
      )}
    </>
  );
}

export default ProjectsPage;
