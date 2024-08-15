import React from 'react'

const outputwindow = ({ outputDetails }) => {
    const getOutput = () => {
        let statusId = outputDetails?.status?.id;
    
        if (statusId === 6) {
          // compilation error
          return (
            <pre className="px-1 py-1 font-normal text-sm text-red-500">
              {atob(outputDetails?.compile_output)}
            </pre>
          );
        } else if (statusId === 3) {
          return (
            <pre className="px-1 py-1 font-normal text-sm text-green-500 ">
              {atob(outputDetails.stdout) !== null
                ? `${atob(outputDetails.stdout)}`
                : null}
            </pre>
          );
        } else if (statusId === 5) {
          return (
            <pre className="px-1 py-1 font-normal text-sm text-red-500 ">
              {`Time Limit Exceeded`}
            </pre>
          );
        } else {
          return (
            <pre className="px-1 py-1 font-normal text-xs text-red-500 ">
              {atob(outputDetails?.stderr)}
            </pre>
          );
        }
      };
  return (
    <div>{outputDetails ? <>{getOutput()}</> : null}</div>
  )
}

export default outputwindow