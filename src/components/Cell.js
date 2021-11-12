import React, { useState, useRef, useEffect } from 'react';

export const Cell = (props) => {
  const { onChange, row, column, getTableValue } = props;
  const [value, setValue] = useState(props.value);
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState(false);
  const timer = useRef(0);
  const delay = useRef(300);
  const singleClick = useRef(false);

  useEffect(() => {
    window.document.addEventListener('unselectAll', handleUnselectAll);
  });

  const onChangeValue = (e) => {
    setValue(e.target.value);
  };

  const handleUnselectAll = () => {
    if (selected || editing) {
      setSelected(false);
      setEditing(false);
    }
  };

  const hasNewValue = (value) => {
    onChange(row, column, value);
    setEditing(false);
  };

  const forceUnselect = () => {
    const unselectAllEvent = new Event('unselectAll');
    window.document.dispatchEvent(unselectAllEvent);
  };

  const letterToNumber = (letter) => {
    return letter.toLowerCase().charCodeAt(0) - 96;
  };

  const parseValue = (value) => {
    let ret;

    if (
      (value.length === 2 &&
        value[0].match(/[a-z]/i) &&
        value.slice(1).match(/[1-9]/i)) ||
      (value.length === 3 &&
        value[1].match(/[a-z]/i) &&
        value.slice(2).match(/[1-9]/i))
    ) {
      let referencedRow =
        value.length === 2
          ? parseInt(value.slice(1))
          : parseInt(value.slice(2));
      let referencedColumn =
        value.length === 2
          ? letterToNumber(value[0])
          : letterToNumber(value[1]);
      let referencedValue = getTableValue(referencedRow, referencedColumn);
      if (Number.isInteger(parseInt(referencedValue.value))) {
        ret = parseInt(referencedValue.value);
      } else if (referencedValue.isFormula) {
        if (value === referencedValue.value) {
          ret = 'ERROR';
        } else {
          ret = calculateValue(null, null, `=${referencedValue.value}`);
        }
      } else {
        ret = 'ERROR';
      }
    } else if (Number.isInteger(parseInt(value))) {
      ret = parseInt(value);
    } else {
      ret = 'ERROR';
    }
    return ret;
  };

  const calculateValue = (x, y, value) => {
    if (value[0] === '=') {
      let result = 0;
      let localValue = value.substring(1);
      let separatedValue = localValue.split(/(?=[+-])|(?<=[+-])/g);
      let parsedSeparatedValues = [];
      for (let pos = 0; pos < separatedValue.length; pos++) {
        let currentCharacter = separatedValue[pos];
        if (currentCharacter === '-') {
          let newValue = `${currentCharacter}${separatedValue[pos + 1]}`;
          parsedSeparatedValues.push(newValue);
          pos++;
        } else if (currentCharacter === '+') {
          //do nothing,sum works by itself
        } else {
          parsedSeparatedValues.push(currentCharacter);
        }
      }
      for (let pos = 0; pos < parsedSeparatedValues.length; pos++) {
        const currentCharacter = parsedSeparatedValues[pos];
        if (pos === 0) {
          let parsedValue = parseValue(currentCharacter);
          if (Number.isInteger(parsedValue)) {
            result = parsedValue;
            if (
              currentCharacter[0] === '-' &&
              !Number.isInteger(parseInt(currentCharacter))
            ) {
              result = parsedValue * -1;
            }
          } else {
            return parsedValue;
          }
        } else {
          let valueToAdd = parseValue(parsedSeparatedValues[pos]);
          if (Number.isInteger(valueToAdd)) {
            if (
              currentCharacter[0] === '-' &&
              !Number.isInteger(parseInt(currentCharacter))
            ) {
              valueToAdd = valueToAdd * -1;
            }
            result = result + valueToAdd;
          } else {
            return valueToAdd;
          }
        }
      }
      return result;
    }
    return value;
  };

  const onClick = () => {
    timer.current = setTimeout(() => {
      if (!singleClick) {
        setSelected(true);
      }
      singleClick.current = false;
    }, delay.current);
  };

  const onDoubleClick = () => {
    clearTimeout(timer.current);
    singleClick.current = true;
    forceUnselect();
    setEditing(true);
    setSelected(true);
  };

  let style = {
    width: '8em',
    padding: '0.5em',
    margin: '0',
    height: '2em',
    boxsizing: 'border-box',
    position: 'relative',
    display: 'inline-block',
    color: 'black',
    border: '1px solid #969393',
    backgroundColor: (row === 0 || column === 0) && '#f0f0f0',
    fontWeight: (row === 0 || column === 0) && 'bold',
    textAlign: row === 0 || column === 0 ? 'center' : 'right',
    verticalAlign: 'top',
    fontSize: '12px',
    lineHeight: '17px',
    overFlow: 'hidden',
    outlineColor: selected ? 'blue' : 'transparent',
    outlineStyle: selected ? 'solid' : 'none'
  };

  if (column === 0) {
    return <span style={style}>{row}</span>;
  }

  if (row === 0) {
    const sidebar = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    return <span style={style}>{sidebar[column]}</span>;
  }

  if (editing) {
    return (
      <input
        style={style}
        onBlur={(e) => hasNewValue(e.target.value)}
        value={value}
        onChange={onChangeValue}
      />
    );
  }

  return (
    <span
      style={style}
      onClick={(e) => onClick(e)}
      onDoubleClick={(e) => onDoubleClick(e)}
    >
      {calculateValue(row, column, value)}
    </span>
  );
};
