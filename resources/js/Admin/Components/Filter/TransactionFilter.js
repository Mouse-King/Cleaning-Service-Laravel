import React from 'react'

export default function TransactionFilter() {
  return (
    <>
        <div className="row">
            <div className="col-sm-3">
                <div className="form-group">
                    <label className="control-label">Date</label>
                    <input type='date' className="form-control" name="title" placeholder="Date"/>
                </div>
            </div>
            <div className="col-sm-3">
                <div className="form-group">
                    <label className="control-label">Job Title</label>
                    <input type='text' className="form-control" name="title" placeholder="Job Title"/>
                </div>
            </div>
            <div className="col-sm-3">
                <div className="form-group">
                    <label className="control-label">Name</label>
                    <input type='text' className="form-control" name="website" placeholder="Name"/>
                </div>
            </div>
            <div className="col-sm-3">
                <div className="d-flex mt-4">
                <button className="btn btn-danger filterBtn">
                    <i className="fas fa-search"></i>
                </button>
                <button className="btn btn-dark ml-1 filterBtn">
                    <i className="fas fa-undo"></i>
                </button>
                </div>
            </div>
        </div>
    </>
  )
}
