import { InlineDatePicker } from 'material-ui-pickers';
import styled from 'styled-components';

const InlineDatePickerWrapper = styled(InlineDatePicker)`
  width: 230px;
  border: 1px solid rgba(0, 0, 0, 0.23) !important;
  background: #FFF;
  border-radius: 5px;

  .WithUtils-DateTextField--input-146 {
    align-items: center;
  }
  
  fieldset, label {
    display: none;
  }
  label + div{
    align-items: center;
  }
`;

export default InlineDatePickerWrapper;
