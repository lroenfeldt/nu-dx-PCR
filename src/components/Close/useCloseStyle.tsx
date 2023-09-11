import React from 'react'
import { useTheme } from '../../assets/theme/ThemeContext'
import { colors } from '../../assets/theme'

const useCloseStyle = () => {
  const { boxShadows} = useTheme()
  const styles = {
    closeBtn: {
      display: 'flex',
      width: '64px',
      height: '64px',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px',
      borderRadius: 44,
      border: `5px solid ${colors.primary.main}`,
      background: '#FFF',
      boxShadow: boxShadows.buttonShadow.main,
    },
  }
  return styles 

}

export default useCloseStyle