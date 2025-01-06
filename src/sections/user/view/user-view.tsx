import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/layouts/dashboard';
import { Scrollbar } from 'src/components/scrollbar';

const DATA_URL = 'https://webapplication2-old-pond-3577.fly.dev/api/Scholarships';

export function UserView() {
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(DATA_URL);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const dataFiltered = data.filter((row) =>
    row.title.toLowerCase().includes(filterName.toLowerCase())
  );

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Programs
        </Typography>
        <Button variant="contained" color="inherit">
          Add Program
        </Button>
      </Box>

      <Card>
        <Box px={3} py={2}>
          <input
            type="text"
            value={filterName}
            placeholder="Search by Title"
            onChange={(e) => {
              setFilterName(e.target.value);
              table.onResetPage();
            }}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={5}>
            <CircularProgress />
          </Box>
        ) : (
          <Scrollbar>
            <TableContainer>
              <Table sx={{ minWidth: 800 }} border={1}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Country</th>
                    <th>University</th>
                    <th>Major</th>
                    <th>Funding</th>
                    <th>Type</th>
                    <th>Level</th>
                    <th>Language Tests</th>
                    <th>Images</th>
                    <th>Course Value</th>
                    <th>University Details</th>
                    <th>Qualifications</th>
                    <th>University Website</th>
                    <th>Department Head</th>
                    <th>Contact Professors</th>
                  </tr>
                </thead>
                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <tr key={row.id.timestamp}>
                        <td>{row.title}</td>
                        <td>{row.country}</td>
                        <td>{row.university}</td>
                        <td>{row.major}</td>
                        <td>{row.funding}</td>
                        <td>{row.type}</td>
                        <td>{row.level}</td>
                        <td>{row.languageTests.join(', ')}</td>
                        <td>{row.images.join(', ')}</td>
                        <td>{row.courseValue}</td>
                        <td>{row.universityDetails}</td>
                        <td>{row.qualifications}</td>
                        <td>
                          <a href={row.universityWebsite} target="_blank" rel="noopener noreferrer">
                            {row.universityWebsite}
                          </a>
                        </td>
                        <td>
                          <b>Name:</b> {row.departmentHead.name}
                          <br />
                          <b>Position:</b> {row.departmentHead.position}
                          <br />
                          <b>Email:</b> {row.departmentHead.email}
                          <br />
                          <b>Research:</b> {row.departmentHead.research}
                          <br />
                          <b>Office:</b> {row.departmentHead.office}
                        </td>
                        <td>
                          {row.contactProfessors.map((prof, index) => (
                            <div key={index}>
                              <b>Name:</b> {prof.name}
                              <br />
                              <b>Position:</b> {prof.position}
                              <br />
                              <b>Email:</b> {prof.email}
                              <br />
                              <b>Research:</b> {prof.research}
                              <br />
                              <b>Office:</b> {prof.office}
                              <br />
                              <hr />
                            </div>
                          ))}
                        </td>
                      </tr>
                    ))}
                  {dataFiltered.length === 0 && (
                    <tr>
                      <td colSpan={15} style={{ textAlign: 'center', padding: '16px' }}>
                        No data found.
                      </td>
                    </tr>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        )}

        <TablePagination
          component="div"
          page={table.page}
          count={dataFiltered.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

export function useTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((_, newPage) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    rowsPerPage,
    onResetPage,
    onChangePage,
    onChangeRowsPerPage,
  };
}
