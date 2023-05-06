package com.tickety.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tickety.domain.enumeration.EventSatus;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Event.
 */
@Entity
@Table(name = "event")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Event implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "creation_date")
    private LocalDate creationDate = LocalDate.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "event_satus")
    private EventSatus eventSatus;

    @Min(value = 0)
    @Column(name = "tal_tickets")
    private Integer talTickets;

    @Column(name = "event_price")
    private Long eventPrice;

    @Column(name = "event_name")
    private String eventName;

    @Column(name = "event_description")
    private String eventDescription;

    @JsonIgnoreProperties(value = { "event" }, allowSetters = true)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(unique = true)
    private Galery galery;

    @OneToMany(mappedBy = "event", fetch = FetchType.EAGER)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "genres", "event" }, allowSetters = true)
    private Set<Artist> artists = new HashSet<>();

    @OneToMany(mappedBy = "event", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "event" }, allowSetters = true)
    private Set<Ticket> tickets = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "USER_ACCOUNT_ID")
    @JsonIgnoreProperties(value = { "events", "roles", "organization" }, allowSetters = true)
    private UserAccount userAccount;

    @ManyToOne
    @JsonIgnoreProperties(value = { "contact", "userAccounts", "events" }, allowSetters = true)
    private Organization organization;

    @ManyToOne
    @JsonIgnoreProperties(value = { "events" }, allowSetters = true)
    private Venue venue;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Event id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public Event date(LocalDate date) {
        this.setDate(date);
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public EventSatus getEventSatus() {
        return this.eventSatus;
    }

    public Event eventSatus(EventSatus eventSatus) {
        this.setEventSatus(eventSatus);
        return this;
    }

    public void setEventSatus(EventSatus eventSatus) {
        this.eventSatus = eventSatus;
    }

    public Integer getTalTickets() {
        return this.talTickets;
    }

    public Event talTickets(Integer talTickets) {
        this.setTalTickets(talTickets);
        return this;
    }

    public void setTalTickets(Integer talTickets) {
        this.talTickets = talTickets;
    }

    public Long getEventPrice() {
        return this.eventPrice;
    }

    public Event eventPrice(Long eventPrice) {
        this.setEventPrice(eventPrice);
        return this;
    }

    public Event eventName(String eventName) {
        this.setEventName(eventName);
        return this;
    }

    public Event eventDescription(String eventDescription) {
        this.setEventDescription(eventDescription);
        return this;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getEventDescription() {
        return eventDescription;
    }

    public void setEventDescription(String eventDescription) {
        this.eventDescription = eventDescription;
    }

    public void setEventPrice(Long eventPrice) {
        this.eventPrice = eventPrice;
    }

    public Galery getGalery() {
        return this.galery;
    }

    public void setGalery(Galery galery) {
        this.galery = galery;
    }

    public Event galery(Galery galery) {
        this.setGalery(galery);
        return this;
    }

    public Set<Artist> getArtists() {
        return this.artists;
    }

    public void setArtists(Set<Artist> artists) {
        if (this.artists != null) {
            this.artists.forEach(i -> i.setEvent(null));
        }
        if (artists != null) {
            artists.forEach(i -> i.setEvent(this));
        }
        this.artists = artists;
    }

    public Event artists(Set<Artist> artists) {
        this.setArtists(artists);
        return this;
    }

    public Event addArtist(Artist artist) {
        this.artists.add(artist);
        artist.setEvent(this);
        return this;
    }

    public Event removeArtist(Artist artist) {
        this.artists.remove(artist);
        artist.setEvent(null);
        return this;
    }

    public Set<Ticket> getTickets() {
        return this.tickets;
    }

    public void setTickets(Set<Ticket> tickets) {
        if (this.tickets != null) {
            this.tickets.forEach(i -> i.setEvent(null));
        }
        if (tickets != null) {
            tickets.forEach(i -> i.setEvent(this));
        }
        this.tickets = tickets;
    }

    public Event tickets(Set<Ticket> tickets) {
        this.setTickets(tickets);
        return this;
    }

    public Event addTicket(Ticket ticket) {
        this.tickets.add(ticket);
        ticket.setEvent(this);
        return this;
    }

    public Event removeTicket(Ticket ticket) {
        this.tickets.remove(ticket);
        ticket.setEvent(null);
        return this;
    }

    public UserAccount getUserAccount() {
        return this.userAccount;
    }

    public void setUserAccount(UserAccount userAccount) {
        this.userAccount = userAccount;
    }

    public Event userAccount(UserAccount userAccount) {
        this.setUserAccount(userAccount);
        return this;
    }

    public Organization getOrganization() {
        return this.organization;
    }

    public void setOrganization(Organization organization) {
        this.organization = organization;
    }

    public Event organization(Organization organization) {
        this.setOrganization(organization);
        return this;
    }

    public Venue getVenue() {
        return this.venue;
    }

    public void setVenue(Venue venue) {
        this.venue = venue;
    }

    public Event venue(Venue venue) {
        this.setVenue(venue);
        return this;
    }

    public LocalDate getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Event)) {
            return false;
        }
        return id != null && id.equals(((Event) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Event{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", eventSatus='" + getEventSatus() + "'" +
            ", talTickets=" + getTalTickets() +
            ", eventPrice=" + getEventPrice() +
            ", eventName=" + getEventName() +
            ", eventDescription=" + getEventDescription() +
            "}";
    }
}
