import {
  Box,
  Divider,
  Select,
  Slider,
  Grid,
  Stack,
  Typography,
  Chip,
  ListItem,
  ListItemText,
  List,
  MenuItem,
  Button,
} from "@mui/material";
import * as React from "react";
import styled from "@emotion/styled";
import PropTypes from "prop-types";
import { Link } from "gatsby";

// -----------------------------
// Label colors
// -----------------------------
const normalizeLabel = (label) => label.toLowerCase().replace(/\s+/g, "-");

const LABEL_COLOR_MAP = {
  "single-stage": "#f0f0f0",
  "multi-stage": "#f0f0f0",
  "multi-proxy": "#f0f0f0",
  "single-proxy": "#f0f0f0",
  preferential: "#f0f0f0",
  epistemic: "#f0f0f0",
  static: "#f0f0f0",
  dynamic: "#f0f0f0",
  strategic: "#f0f0f0",
  "non-strategic": "#f0f0f0",
  deterministic: "#f0f0f0",
  stochastic: "#f0f0f0",
  "restricted": "#f0f0f0",
  "unconstrained": "#f0f0f0",
  centralized: "#f0f0f0",
  emergent: "#f0f0f0",
  "cycles-tolerant": "#f0f0f0",
  "cycles-intolerant": "#f0f0f0",
  publications: "#4caf50", // green background for publications
  arxiv: "#4caf50",        // used for border/font only
};

// -----------------------------
// Chip
// -----------------------------
const labelChip = (label, deleteable, selLabels, setSelLabels, type = "label", url = null) => {
  const isArxiv = type === "arxiv";
  const isPublication = type === "publication";
  const clickable = url != null || type === "label"; // allow label clicks too

  const handleClick = () => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      // toggle label selection for filtering
      if (selLabels.includes(label)) {
        setSelLabels(selLabels.filter((l) => l !== label));
      } else {
        setSelLabels([...selLabels, label]);
      }
    }
  };

  return (
    <Chip
      size="small"
      key={label}
      label={label}
      variant={isArxiv ? "outlined" : "filled"}
      sx={{
        bgcolor: isArxiv
          ? "#ffffff"
          : isPublication
          ? LABEL_COLOR_MAP["publications"]
          : LABEL_COLOR_MAP[normalizeLabel(label)],
        color: isArxiv ? "#4caf50" : "black",
        borderColor: isArxiv ? "#4caf50" : undefined,
        cursor: clickable ? "pointer" : "default",
      }}
      onClick={handleClick}
      onDelete={
        deleteable && selLabels.includes(label)
          ? () => setSelLabels(selLabels.filter((l) => l !== label))
          : undefined
      }
    />
  );
};

// -----------------------------
// Styled components
// -----------------------------
const openInNewTab = (url) => {
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (newWindow) newWindow.opener = null;
};

const AuthorText = styled("div")`
  color: #878787;
`;

const PriorTitleText = styled("div")`
  color: #878787;
  font-weight: bold;
`;

const TitleText = styled("div")`
  font-weight: bold;
`;

// -----------------------------
// Constants
// -----------------------------
function minDateOfPaper(paper) {
  const fullDates = paper.publications
    .filter((pub) => pub.month !== undefined)
    .map((pub) => new Date(pub.year, pub.month, pub.day));

  if (fullDates.length > 0) {
    return new Date(Math.min(...fullDates));
  } else {
    const dates = paper.publications.map(
      (pub) =>
        new Date(
          pub.year,
          pub.month === undefined ? 0 : pub.month,
          pub.day === undefined ? 0 : pub.day
        )
    );
    return new Date(Math.min(...dates));
  }
}

function stringCmp(a, b) {
  var nameA = a.toUpperCase();
  var nameB = b.toUpperCase();
  if (nameA < nameB) return -1;
  if (nameA > nameB) return 1;
  return 0;
}

const SORT_YEAR_TOP_DOWN = "Newest first";
const SORT_YEAR_BOTTOM_UP = "Oldest first";
const sortOptions = [SORT_YEAR_BOTTOM_UP, SORT_YEAR_TOP_DOWN];

const TYPE_LABELS = [];
const PRIOR_LABEL = "prior/related work";
let SPECIAL_LABELS = [...TYPE_LABELS];

// -----------------------------
// Main component
// -----------------------------
const PaperList = ({ data }) => {
  // preprocessing
  const allYears = data.flatMap((paper) =>
    paper.publications.flatMap((pub) => pub.year)
  );
  let distinctYears = [...new Set(allYears)].sort();

  const allLabels = data.flatMap((paper) => (paper.labels ? paper.labels : []));
  let distinctLabels = [...new Set(allLabels)].sort((a,b)=>{
    // preserve desired order
    const order = [
      "single-stage","multi-stage",
      "epistemic","preferential",
      "single-proxy","multi-proxy",
      "deterministic","stochastic",
      "substitutive","complementary",
      "restricted","unconstrained",
      "strategic","non-strategic",
      "static","dynamic",
      "centralized","emergent",
      "cycles-tolerant","cycles-intolerant"
    ];
    return order.indexOf(normalizeLabel(a)) - order.indexOf(normalizeLabel(b));
  });
  distinctLabels = distinctLabels.filter((el) => !SPECIAL_LABELS.includes(el));

  // state
  const [yearsIdx, setYearsIdx] = React.useState([0, distinctYears.length - 1]);
  const [sort, setSort] = React.useState(SORT_YEAR_TOP_DOWN);
  const [selLabels, setSelLabels] = React.useState([]);

  // build paper chips
  const paperChips = (paper) => {
    const labels = "labels" in paper ? paper.labels : [];
    labels.sort((a,b)=>{
      const order = [
      "single-stage","multi-stage",
      "epistemic","preferential",
      "single-proxy","multi-proxy",
      "deterministic","stochastic",
      "substitutive","complementary",
      "restricted","unconstrained",
      "strategic","non-strategic",
      "static","dynamic",
      "centralized","emergent",
"cycles-tolerant","cycles-intolerant"
      ];
      return order.indexOf(normalizeLabel(a)) - order.indexOf(normalizeLabel(b));
    });

    let chips = [];

    // publications first
    paper.publications.forEach((pub) => {
      const name = "displayName" in pub ? pub.displayName : pub.name;
      const text = name + " '" + pub.year.toString().slice(-2);
const type =
  ["arxiv", "pers. repo.", "iacr"].includes(name.toLowerCase())
    ? "arxiv"
    : "publication";      chips.push(
        labelChip(text, false, selLabels, setSelLabels, type, pub.url)
      );
    });

    // then labels (blue)
    chips = chips.concat(
      labels.map((label) => labelChip(label, false, selLabels, setSelLabels))
    );

    return chips;
  };

  const buildListItems = (data) =>
    data.map((paper, i) => (
      <ListItem key={i}>
        <ListItemText
          primary={
            <Stack direction="row" spacing={3}>
              {paper.labels.includes(PRIOR_LABEL) ? (
                <PriorTitleText>{paper.title}</PriorTitleText>
              ) : (
                <TitleText>{paper.title}</TitleText>
              )}
              <AuthorText>{paper.authors}</AuthorText>
              <Grid spacing={1} justifyContent={"center"}>
                {paperChips(paper)}
              </Grid>
            </Stack>
          }
        />
      </ListItem>
    ));

  const selTypeLabels = selLabels.filter((l) => TYPE_LABELS.includes(l));
  const selNonTypeLabels = selLabels.filter((l) => !TYPE_LABELS.includes(l));

  const filteredData = data
    .filter((p) =>
      p.publications.some(
        (pub) =>
          distinctYears[yearsIdx[0]] <= pub.year &&
          pub.year <= distinctYears[yearsIdx[1]]
      )
    )
    .filter(
      (p) =>
        (selTypeLabels.length === 0 ||
          selTypeLabels.every((l) => p.labels.includes(l))) &&
        (selNonTypeLabels.length === 0 ||
          p.labels.some((l) => selNonTypeLabels.includes(l)))
    );

  const sortedData = filteredData.sort((p1, p2) =>
    sort === SORT_YEAR_TOP_DOWN
      ? minDateOfPaper(p2) - minDateOfPaper(p1)
      : minDateOfPaper(p1) - minDateOfPaper(p2)
  );

  const items = buildListItems(sortedData);

  const marks = distinctYears.map((y, i) => ({
    value: i,
    label: "'" + y.toString().slice(-2),
  }));

  return (
    <div>
      <Stack direction="row" justifyContent={"space-between"} alignItems="center">
        <Stack direction="row" p={1} spacing={2} alignItems="center">
          <Box sx={{ width: 650, pr: 2 }}>
            <Slider
              value={yearsIdx}
              step={null}
              max={distinctYears.length - 1}
              onChange={(_, newValue) => setYearsIdx(newValue)}
              valueLabelFormat={(value) => distinctYears[value]}
              valueLabelDisplay="auto"
              marks={marks}
              disableSwap
            />
          </Box>
          <Select
            value={sort}
            autoWidth={true}
            onChange={(event) => setSort(event.target.value)}
          >
            {sortOptions.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </Select>
          <Typography>{items.length} papers</Typography>
        </Stack>
        {selLabels.length > 0 && (
          <Button variant="contained" color="error" onClick={() => setSelLabels([])}>
            Reset
          </Button>
        )}
      </Stack>
      <Divider />
      <Stack
        spacing={1}
        direction="row"
        alignItems="stretch"
        justifyContent={"space-between"}
      >
        <List dense="true">{items}</List>
        <Box sx={{ display: "flex" }}>
          <Divider orientation={"vertical"} flexItem />
          <Stack flexWrap={"wrap"} width={300} pl={1} pt={1} spacing={1} direction="column">
            {distinctLabels.map((l, i) => (
              <React.Fragment key={l}>
                {labelChip(l, true, selLabels, setSelLabels)}
                {(i + 1) % 2 === 0 && (
                  <Divider sx={{ borderColor: "#bbb", borderWidth: "1.2px", my: 1.2 }} />
                )}
              </React.Fragment>
            ))}
<Typography 
              variant="caption" 
              display="block" 
              sx={{ textAlign: 'right', mt: 2, color: 'text.secondary' }}
            >
              What are these labels? - {' '}
              <Link 
                to="/about" 
                style={{ color: '#1976d2', textDecoration: 'underline' }}
              >
                check here
              </Link>
            </Typography>

                  
          </Stack>
        </Box>
      </Stack>
    </div>
  );
};

PaperList.propTypes = {
  data: PropTypes.array,
};

export default PaperList;
