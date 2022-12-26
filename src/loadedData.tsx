function LoadedData (props: any): any {
  return (
    <div id="loadedData">
        <div className="row">
            {
                props.errors.map((error: any) => {
                    <p key={error.message}>{ error.message }</p>
                })
            }
        </div>
        <div className="row">
            { props.csvRows.length > 0 && 
                props.csvRows.map((row: any, index: number) => {
                    <p key={index}>{ row }</p>
                })
            }
            { props.csvColumns.length > 0 && 
                props.csvColumns.map((column: any) => {
                    <p key={column}>{ column }</p>
                })
            }
        </div>
    </div>
  )
}

export default LoadedData;
