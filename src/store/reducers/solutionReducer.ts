// action - state management
import * as actionTypes from "../actions";

export interface ISolutionFolder {
  folderId?: string;
  folderName: string;
  createdAt?: string;
}

interface IinitialState {
  folderId: string;
  folderName: string;
}

export const initialState: IinitialState = {
  folderId: "",
  folderName: "",
};

// ==============================|| SOLUTION REDUCER ||============================== //

const solutionReducer = (state: IinitialState = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.SET_SLT_SOLUTION_FOLDER:
      return {
        ...state,
        folderId: action.payload.folderId,
        folderName: action.payload.folderName,
      };

    default:
      return state;
  }
};

export default solutionReducer;
