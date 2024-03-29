// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Typography, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Snackbar, Alert } from '@mui/material';
// import Skeleton from 'react-loading-skeleton';
// import Pagination from './Pagination';
// import Search from './Search';
// import CheckIcon from '@mui/icons-material/Check';
// import CloseIcon from '@mui/icons-material/Close';

// const LeaveList = () => {
//   const [leaveRequests, setLeaveRequests] = useState([]);
//   const [editLeave, setEditLeave] = useState(null);
//   const [updatedLeave, setUpdatedLeave] = useState({});
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [snackbarMessage, setSnackbarMessage] = useState('');
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const itemsPerPage = 4;

//   useEffect(() => {
//     const fetchLeaveRequests = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get('https://lms-be-tk3j.onrender.com/api/leaves/list', {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         const sortedLeaveRequests = response.data.leaveRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//         setLeaveRequests(sortedLeaveRequests);
//       } catch (error) {
//         setError(error.response?.data?.message || 'Failed to fetch leave requests.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLeaveRequests();
//   }, []);

//   const handleSearch = (term) => {
//     setSearchTerm(term);
//   };

//   const handleUpdateLeave = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(`https://lms-be-tk3j.onrender.com/api/leaves/${editLeave._id}/update`, updatedLeave, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       const updatedLeaveRequests = leaveRequests.map(request => request._id === editLeave._id ? updatedLeave : request);
//       setLeaveRequests(updatedLeaveRequests);
//       setEditLeave(null);
//       setSnackbarMessage('Leave request updated successfully');
//       setOpenSnackbar(true);
//     } catch (error) {
//       setError(error.response.data.message || 'Failed to update leave request.');
//       setSnackbarMessage('Failed to update leave request.');
//       setOpenSnackbar(true);
//     }
//   };

//   const clearError = () => {
//     setError(null);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setUpdatedLeave({ ...updatedLeave, [name]: value });
//   };

//   const handleEditLeave = (leave) => {
//     setEditLeave(leave);
//     setUpdatedLeave({ ...leave });
//   };

//   const onPageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const filteredLeaveRequests = leaveRequests.filter(request =>
//     request.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     request.status.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredLeaveRequests.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredLeaveRequests.length / itemsPerPage);

//   return (
//     <div>
//       <Typography variant="h2" gutterBottom>Leave Requests</Typography>
      
//       <Search label="Search by type and status" onSearch={handleSearch} />
      
//       {loading && (
//         <TableContainer component={Paper}>
//           <Table>
//             <TableBody>
//               {Array.from({ length: itemsPerPage }).map((_, index) => (
//                 <TableRow key={index}>
//                   <TableCell><Skeleton /></TableCell>
//                   <TableCell><Skeleton /></TableCell>
//                   <TableCell><Skeleton /></TableCell>
//                   <TableCell><Skeleton /></TableCell>
//                   <TableCell><Skeleton /></TableCell>
//                   <TableCell><Skeleton /></TableCell>
//                   <TableCell><Skeleton /></TableCell>
//                   <TableCell><Skeleton /></TableCell>
//                   <TableCell><Skeleton /></TableCell>
//                   <TableCell><Skeleton /></TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}

//       {!loading && error && (
//         <Typography variant="h6" align="center" style={{ color: 'red' }}>{error}</Typography>
//       )}
      
//       {!loading && filteredLeaveRequests.length === 0 && (
//         <Typography variant="h6" align="center" style={{ color: 'grey' }}>No results found for {searchTerm}</Typography>
//       )}

//       {!loading && !error && (
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Start Date</TableCell>
//                 <TableCell>End Date</TableCell>
//                 <TableCell>Reason</TableCell>
//                 <TableCell>Type</TableCell>
//                 <TableCell>No Of Days</TableCell>
//                 <TableCell>Substitute</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell>Comments</TableCell>
//                 <TableCell>Edit</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {currentItems.map((request) => (
//                 <TableRow key={request._id}>
//                   <TableCell>{request.startDate}</TableCell>
//                   <TableCell>{request.endDate}</TableCell>
//                   <TableCell>
//                     {request.reason.length > 50 ? (
//                       <>
//                         {request.reason.slice(0, 50)}...
//                         <Button variant="text" color="primary" onClick={() => alert(request.reason)}>Read More</Button>
//                       </>
//                     ) : (
//                       request.reason
//                     )}
//                   </TableCell>
//                   <TableCell>{request.type}</TableCell>
//                   <TableCell>{request.numberOfDays}</TableCell>
//                   <TableCell>{request.substitute}</TableCell>
//                   <TableCell>{request.status}</TableCell>
//                   <TableCell>
//                     {request.comments.length > 0 && (
//                       <ul>
//                         {request.comments.map((comment, index) => (
//                           <li key={index}>
//                             <span className="comment">{comment.comment}</span>
//                             <br />
//                             {comment.commentedBy && comment.commentedBy.username && (
//                               <small className='commentedBy'>Commented by: {comment.commentedBy.username}</small>
//                             )}
//                           </li>
//                         ))}
//                       </ul>
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     {request.status !== "approved" && request.status !== "rejected" && (
//                       <Button variant="outlined" onClick={() => handleEditLeave(request)}>Edit</Button>
//                     )}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}

//       {!loading && error && (
//         <Snackbar open={true} autoHideDuration={6000} onClose={clearError}>
//           <Alert onClose={clearError} severity="error">
//             {error}
//           </Alert>
//         </Snackbar>
//       )}

//       <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      
//       <Dialog open={editLeave !== null} onClose={() => setEditLeave(null)}>
//         <DialogTitle>Edit Leave Request</DialogTitle>
//         <DialogContent>
//           <TextField
//             name="startDate"
//             label="Start Date"
//             value={updatedLeave.startDate || ''}
//             onChange={handleInputChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             name="endDate"
//             label="End Date"
//             value={updatedLeave.endDate || ''}
//             onChange={handleInputChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             name="reason"
//             label="Reason"
//             value={updatedLeave.reason || ''}
//             onChange={handleInputChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             name="type"
//             label="Type"
//             value={updatedLeave.type || ''}
//             onChange={handleInputChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             name="numberOfDays"
//             label="Number of Days"
//             value={updatedLeave.numberOfDays || ''}
//             onChange={handleInputChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             name="substitute"
//             label="Substitute"
//             value={updatedLeave.substitute || ''}
//             onChange={handleInputChange}
//             fullWidth
//             margin="normal"
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button variant="contained" startIcon={<CheckIcon />} onClick={handleUpdateLeave}>Update</Button>
//           <Button variant="contained" startIcon={<CloseIcon />} onClick={() => setEditLeave(null)}>Cancel</Button>
//         </DialogActions>
//       </Dialog>
      
//       <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
//         <Alert onClose={() => setOpenSnackbar(false)} severity="success">
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// };

// export default LeaveList;











import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Snackbar, Alert } from '@mui/material';
import Skeleton from 'react-loading-skeleton';
import Pagination from './Pagination';
import Search from './Search';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const LeaveList = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [editLeave, setEditLeave] = useState(null);
  const [updatedLeave, setUpdatedLeave] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://lms-be-tk3j.onrender.com/api/leaves/list', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const sortedLeaveRequests = response.data.leaveRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setLeaveRequests(sortedLeaveRequests);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch leave requests.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleUpdateLeave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://lms-be-tk3j.onrender.com/api/leaves/${editLeave._id}/update`, updatedLeave, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const updatedLeaveRequests = leaveRequests.map(request => request._id === editLeave._id ? updatedLeave : request);
      setLeaveRequests(updatedLeaveRequests);
      setEditLeave(null);
      setSnackbarMessage('Leave request updated successfully');
      setOpenSnackbar(true);
    } catch (error) {
      setError(error.response.data.message || 'Failed to update leave request.');
      setSnackbarMessage('Failed to update leave request.');
      setOpenSnackbar(true);
    }
  };

  const handleDeleteLeave = async (leaveId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://lms-be-tk3j.onrender.com/api/leaves/${leaveId}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const updatedLeaveRequests = leaveRequests.filter(request => request._id !== leaveId);
      setLeaveRequests(updatedLeaveRequests);
      setSnackbarMessage('Leave request deleted successfully');
      setOpenSnackbar(true);
    } catch (error) {
      setError(error.response.data.message || 'Failed to delete leave request.');
      setSnackbarMessage('Failed to delete leave request.');
      setOpenSnackbar(true);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedLeave({ ...updatedLeave, [name]: value });
  };

  const handleEditLeave = (leave) => {
    setEditLeave(leave);
    setUpdatedLeave({ ...leave });
  };

  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filteredLeaveRequests = leaveRequests.filter(request =>
    request.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLeaveRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLeaveRequests.length / itemsPerPage);

  return (
    <div>
      <Typography variant="h2" gutterBottom>Leave Requests</Typography>
      
      <Search label="Search by type and status" onSearch={handleSearch} />
      
      {loading && (
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {Array.from({ length: itemsPerPage }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!loading && error && (
        <Typography variant="h6" align="center" style={{ color: 'red' }}>{error}</Typography>
      )}
      
      {!loading && filteredLeaveRequests.length === 0 && (
        <Typography variant="h6" align="center" style={{ color: 'grey' }}>No results found for {searchTerm}</Typography>
      )}

      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>No Of Days</TableCell>
                <TableCell>Substitute</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Comments</TableCell>
                <TableCell>Edit</TableCell>
                <TableCell>Delete</TableCell> {/* Add delete column header */}
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.map((request) => (
                <TableRow key={request._id}>
                  <TableCell>{request.startDate}</TableCell>
                  <TableCell>{request.endDate}</TableCell>
                  <TableCell>
                    {request.reason.length > 50 ? (
                      <>
                        {request.reason.slice(0, 50)}...
                        <Button variant="text" color="primary" onClick={() => alert(request.reason)}>Read More</Button>
                      </>
                    ) : (
                      request.reason
                    )}
                  </TableCell>
                  <TableCell>{request.type}</TableCell>
                  <TableCell>{request.numberOfDays}</TableCell>
                  <TableCell>{request.substitute}</TableCell>
                  <TableCell>{request.status}</TableCell>
                  <TableCell>
                    {request.comments.length > 0 && (
                      <ul>
                        {request.comments.map((comment, index) => (
                          <li key={index}>
                            <span className="comment">{comment.comment}</span>
                            <br />
                            {comment.commentedBy && comment.commentedBy.username && (
                              <small className='commentedBy'>Commented by: {comment.commentedBy.username}</small>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </TableCell>
                  <TableCell>
                    {request.status !== "approved" && request.status !== "rejected" && (
                      <Button variant="outlined" onClick={() => handleEditLeave(request)}>Edit</Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="outlined" color="error" onClick={() => handleDeleteLeave(request._id)}>Delete</Button> {/* Add delete button */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!loading && error && (
        <Snackbar open={true} autoHideDuration={6000} onClose={clearError}>
          <Alert onClose={clearError} severity="error">
            {error}
          </Alert>
        </Snackbar>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      
      <Dialog open={editLeave !== null} onClose={() => setEditLeave(null)}>
        <DialogTitle>Edit Leave Request</DialogTitle>
        <DialogContent>
          <TextField
            name="startDate"
            label="Start Date"
            value={updatedLeave.startDate || ''}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="endDate"
            label="End Date"
            value={updatedLeave.endDate || ''}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="reason"
            label="Reason"
            value={updatedLeave.reason || ''}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="type"
            label="Type"
            value={updatedLeave.type || ''}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="numberOfDays"
            label="Number of Days"
            value={updatedLeave.numberOfDays || ''}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="substitute"
            label="Substitute"
            value={updatedLeave.substitute || ''}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" startIcon={<CheckIcon />} onClick={handleUpdateLeave}>Update</Button>
          <Button variant="contained" startIcon={<CloseIcon />} onClick={() => setEditLeave(null)}>Cancel</Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LeaveList;
