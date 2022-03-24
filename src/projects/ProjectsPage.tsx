import React, { useEffect, useState } from 'react';
import { useProjects } from './projectHooks';
import ProjectList from './ProjectList';

function ProjectsPage() {
  const { data, isLoading, error, isFetching, page, setPage, isPreviousData } =
    useProjects();

  const handleMoreClick = () => {
    setPage((currentPage) => currentPage + 1);
  };

  if (data) {
    return (
      <>
        <h1>Projects</h1>
        <ProjectList projects={data} />
        <div className="row">
          <div className="col-sm-12">
            <div className="button-group fluid">
              <button className="button default" onClick={handleMoreClick}>
                More...
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <h1>Projects</h1>
        <div className="center-page">
          <span className="spinner primary"></span>
          <p>Loading...</p>
        </div>
      </>
    );
  }

  if (error instanceof Error) {
    return (
      <>
        <h1>Projects</h1>
        <div className="row">
          <div className="card large error">
            <section>
              <p>
                <span className="icon-alert inverse "></span>
                {error.message}
              </p>
            </section>
          </div>
        </div>
      </>
    );
  }

  return null;
}

export default ProjectsPage;
