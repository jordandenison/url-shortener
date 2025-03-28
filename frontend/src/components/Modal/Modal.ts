import { connect } from 'react-redux'

import type { AppDispatch, RootState } from '../../redux/store'
import { closeAll } from '../../redux/features/modal/modalSlice'
import { selectShowModal } from '../../redux/selectors'

import { ModalView } from './ModalView'

interface OwnProps {
  modalName: string
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  show: selectShowModal(ownProps.modalName, state)
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  close: (): void => {
    dispatch(closeAll())
  }
})

export const Modal = connect(mapStateToProps, mapDispatchToProps)(ModalView)
