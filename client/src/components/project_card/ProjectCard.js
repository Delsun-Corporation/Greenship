import React from "react";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

function LongMenu({ duplicate, projectId, deleteProject, openProject, lastPage }) {
  const options = [
    'Edit',
    'Delete',
    'Duplicate'
  ];
  const ITEM_HEIGHT = 48;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event, item) => {
    if (item !== null || item !== undefined) {
      if (item === "Edit") {
        openProject(projectId, lastPage);
      } else if (item === "Delete") {
        deleteProject(projectId);
      } else if (item === "Duplicate") {
        duplicate(projectId);
      }
    }
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreHorizIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} onClick={(event) => handleClose(event, option)} defaultValue={`${option}`}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

function ProjectCard({ project, projectId, lastPage, duplicateProject, deleteProject, openProject }) {
  return (
    <div className="w-full h-36 bg-white flex flex-row p-2 rounded-lg">
      <div className="bg-gray-200 w-1/4 h-full">
        <img
          src={project.project_image}
          alt={project.project_name}
          className="w-full h-full object-cover rounded-lg"
        ></img>
      </div>
      <div className="bg-transparant w-3/4 h-full flex-col flex pl-3">
        <div className="flex flex-row h-1/5">
          <h1 className="font-body font-medium text-coolGrey text-xs w-3/4 h-full align-middle flex items-center">
            {project._id.toString()}
          </h1>
          <div
            className={
              project.project_status.toString().toLowerCase() === "draft"
                ? "bg-antiqueBrass justify-center w-1/4 rounded-lg h-full items-center flex"
                : "bg-maximumBlue justify-center w-1/4 rounded-lg h-full items-center flex"
            }
          >
            <h1 className="font-body font-bold text-white text-xs">{project.project_status}</h1>
          </div>
        </div>
        <div className="flex flex-col h-3/5 pt-2">
            <h1 className="font-body font-bold text-lg truncate h-1/2">
                {project.project_name}
            </h1>
            <h4 className="font-body font-medium text-sm text-coolGrey h-2/3 w-full overflow-ellipsis overflow-hidden whitespace-nowrap leading-6">
                {project.project_desc}
            </h4>
        </div>
        <div className="flex flex-row-reverse h-1/5">
          <LongMenu className="h-1/4" duplicate={duplicateProject} projectId={`${project._id.toString()}`} deleteProject={deleteProject} openProject={openProject} lastPage={lastPage}/>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
