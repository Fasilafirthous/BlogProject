import { Popover, Typography } from '@mui/material';
import Person2TwoToneIcon from '@mui/icons-material/Person2TwoTone';
import './popOver.css';
export interface PopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  handleOpenEditDialog: ()=> void
}

function ProfilePopover(props: PopoverProps) {
  const {handleOpenEditDialog, open, anchorEl, onClose } = props;

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      
    >
      <div className='profile-popover'  onClick={handleOpenEditDialog}>
      <Person2TwoToneIcon/>
      <Typography sx={{ p: 2 }}>Profile</Typography>
      </div>
    </Popover>
  );
}

export default ProfilePopover;
