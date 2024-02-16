import React, { useRef, useState } from "react";
import { Transition } from "react-transition-group";
import { Button, Box, Modal, ModalDialog, Typography } from "@mui/joy";
import { useNavigate } from "react-router-dom";

const SubmitButtonAndModal = ({ open, setOpen, handleSubmit }) => {
  const modalRef = useRef(null);
  const [successPopup, setSuccessPopup] = useState(false);
  const navigate = useNavigate();

  const handleSuccessClose = () => {
    setSuccessPopup(false);
    setOpen(false);
    navigate("/home");
  };

  return (
    <React.Fragment>
      <Button variant="outlined" color="neutral" onClick={() => setOpen(true)}>
        Submit Leave
      </Button>

      <Transition in={open} timeout={400}>
        {(state) => (
          <Modal
            ref={modalRef}
            keepMounted
            open={!["exited", "exiting"].includes(state)}
            onClose={() => setOpen(false)}
            slotProps={{
              backdrop: {
                sx: {
                  opacity: 0,
                  backdropFilter: "none",
                  transition: `opacity 400ms, backdrop-filter 400ms`,
                  ...{
                    entering: { opacity: 1, backdropFilter: "blur(8px)" },
                    entered: { opacity: 1, backdropFilter: "blur(8px)" },
                  }[state],
                },
              },
            }}
            sx={{
              visibility: state === "exited" ? "hidden" : "visible",
            }}
          >
            <ModalDialog
              sx={{
                opacity: 0,
                transition: `opacity 300ms`,
                ...{
                  entering: { opacity: 1 },
                  entered: { opacity: 1 },
                }[state],
              }}
            >
              <Typography id="nested-modal-title" level="h2">
                Confirm
              </Typography>
              <Typography
                id="nested-modal-description"
                textColor="text.tertiary"
              >
                Please check your information before confirming.
              </Typography>
              <Box
                sx={{
                  mt: 1,
                  display: "flex",
                  gap: 1,
                  flexDirection: { xs: "column", sm: "row-reverse" },
                }}
              >
                <Button
                  type="submit"
                  variant="solid"
                  color="primary"
                  onClick={() => {
                    handleSubmit();
                    setOpen(false);
                    setSuccessPopup(true);
                  }}
                >
                  Confirm
                </Button>
                <Button
                  variant="outlined"
                  color="neutral"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
              </Box>
            </ModalDialog>
          </Modal>
        )}
      </Transition>

      <Modal open={successPopup} onClose={handleSuccessClose}>
        <ModalDialog>
          <Typography id="nested-modal-title" level="h2">
            Success Leave
          </Typography>
          <Typography id="nested-modal-description" textColor="text.tertiary">
            Your leave has been submitted successfully.
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Button
              variant="solid"
              color="primary"
              onClick={handleSuccessClose}
            >
              Close
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
};

export default SubmitButtonAndModal;
