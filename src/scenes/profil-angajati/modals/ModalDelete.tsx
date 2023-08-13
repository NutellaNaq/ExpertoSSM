import { GridRowModel } from "@mui/x-data-grid";

type ModalDeleteProps = {
  handleDeleteSingleRow: (rowData: GridRowModel) => Promise<void>;
  rowToDelete: GridRowModel;
  handleSetModalDeleteSingleRow: (isOpen: boolean) => void; // Replace with the actual type if needed
};

const ModalDelete: React.FC<ModalDeleteProps> = ({
  handleDeleteSingleRow,
  rowToDelete,
  handleSetModalDeleteSingleRow,
}) => {
  const handleConfirmDelete = async () => {
    await handleDeleteSingleRow(rowToDelete);
    handleSetModalDeleteSingleRow(false); // Close the delete modal after deletion
  };

  const handleCancelDelete = () => {
    handleSetModalDeleteSingleRow(false); // Close the delete modal without deleting
  };

  return (
    <div className="modal">
      <div className="modal-main">
        <div className="flex justify-center">
          <h3>
            Esti sigur ca doresti sa stergi angajatul{" "}
            {rowToDelete.nume + " " + rowToDelete.prenume}?{" "}
          </h3>
        </div>
        <div className="flex justify-center" style={{ paddingTop: "1rem" }}>
          <button className="button-style-1" onClick={handleConfirmDelete}>
            Da
          </button>
          <button className="button-style-2" onClick={handleCancelDelete}>
            Nu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDelete;
