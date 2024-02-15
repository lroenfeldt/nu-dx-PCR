import { IProgressBar } from "../types/components";

const ProgressBar = ({ startTime, remTime }: IProgressBar) => {
  let progress = 100 - (100 / startTime) * remTime;

  return (
    <div className="progress-outer">
      <div className="progress-inner" style={{ width: `${progress}%` }} />
    </div>
  );
};

export default ProgressBar;
