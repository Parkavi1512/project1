import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Button, Grid,
  Card, CardContent, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  LinearProgress, Alert, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  TablePagination, TextField, MenuItem
} from '@mui/material';
import {
  Edit, Delete, Visibility, Refresh,
  FilterList, Search, CheckCircle, Cancel
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../utils/constants';

const ManageInternships = () => {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  useEffect(() => {
    fetchInternships();
  }, []);

  useEffect(() => {
    filterInternships();
  }, [internships, searchTerm, statusFilter, typeFilter]);

  const fetchInternships = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/recruiter/internships`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInternships(response.data);
      setFilteredInternships(response.data);
    } catch (error) {
      console.error('Error fetching internships:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterInternships = () => {
    let filtered = internships;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(internship =>
        internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(internship => internship.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(internship => internship.type === typeFilter);
    }

    setFilteredInternships(filtered);
    setPage(0); // Reset to first page when filtering
  };

  const handleDeleteClick = (id) => {
    setDeleteDialog({ open: true, id });
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/recruiter/internships/${deleteDialog.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setInternships(internships.filter(internship => internship._id !== deleteDialog.id));
      setDeleteDialog({ open: false, id: null });
    } catch (error) {
      console.error('Error deleting internship:', error);
      alert('Failed to delete internship');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      'active': { color: 'success', label: 'Active' },
      'inactive': { color: 'default', label: 'Inactive' },
      'expired': { color: 'error', label: 'Expired' },
      'filled': { color: 'info', label: 'Filled' }
    };
    
    const config = statusConfig[status] || { color: 'default', label: status };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const getTypeChip = (type) => {
    const typeColors = {
      'full-time': 'primary',
      'part-time': 'secondary',
      'remote': 'info',
      'hybrid': 'warning'
    };
    
    return (
      <Chip 
        label={type.charAt(0).toUpperCase() + type.slice(1)} 
        color={typeColors[type] || 'default'} 
        size="small" 
        variant="outlined"
      />
    );
  };

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Manage Internships
      </Typography>

      {/* Filters and Search */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search internships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              select
              fullWidth
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="expired">Expired</MenuItem>
              <MenuItem value="filled">Filled</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              select
              fullWidth
              label="Type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="full-time">Full-time</MenuItem>
              <MenuItem value="part-time">Part-time</MenuItem>
              <MenuItem value="remote">Remote</MenuItem>
              <MenuItem value="hybrid">Hybrid</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setTypeFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Refresh />}
              onClick={fetchInternships}
            >
              Refresh
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Internships Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Applications</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Posted Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInternships
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((internship) => (
                  <TableRow key={internship._id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {internship.title}
                      </Typography>
                    </TableCell>
                    <TableCell>{internship.company}</TableCell>
                    <TableCell>{internship.location}</TableCell>
                    <TableCell>
                      {getTypeChip(internship.type)}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={internship.applications || 0}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {getStatusChip(internship.status)}
                    </TableCell>
                    <TableCell>
                      {new Date(internship.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        size="small" 
                        onClick={() => navigate(`/internship/${internship._id}`)}
                        title="View"
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => navigate(`/recruiter/edit-internship/${internship._id}`)}
                        title="Edit"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteClick(internship._id)}
                        title="Delete"
                        color="error"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredInternships.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Stats Summary */}
      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Internships
              </Typography>
              <Typography variant="h4">
                {internships.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Active Internships
              </Typography>
              <Typography variant="h4" color="success.main">
                {internships.filter(i => i.status === 'active').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Applications
              </Typography>
              <Typography variant="h4" color="primary.main">
                {internships.reduce((sum, i) => sum + (i.applications || 0), 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Filled Positions
              </Typography>
              <Typography variant="h4" color="info.main">
                {internships.filter(i => i.status === 'filled').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
      >
        <DialogTitle>Delete Internship</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this internship? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageInternships;